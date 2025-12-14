import { StrictMode, useEffect, useRef, useState, type JSX } from "react";

import "./wordle-app.scss";

import { AppStateReducerActionType, keyboardKeys } from "../constants/wordle-constants.ts";
import { isKeyboardKey } from "../utils/wordle-utils.ts";
import { GuessContainer, Header, Keyboard, MorePopup, StatsPopup, useAppStateReducer, useCurrentGameState, WordleAppContextProvider } from "./index.ts";


export function WordleApp(): JSX.Element {
  return (
    <StrictMode>
			<WordleAppContextProvider>
				<WordleAppInternal />
			</WordleAppContextProvider>
    </StrictMode>
  );
}

function WordleAppInternal(): JSX.Element {
	const gameState = useCurrentGameState();
	const dispatch = useAppStateReducer();
	const [statsPopupIsShowing, setStatsPopupIsShowing] = useState(false);
	const [morePopupIsShowing, setMorePopupIsShowing] = useState(false);
  const openStatsPopup = () => setStatsPopupIsShowing(true);
	const openMorePopup = () => setMorePopupIsShowing(true);
	const closeStatsPopup = () => setStatsPopupIsShowing(false);
	const closeMorePopup = () => setMorePopupIsShowing(false);
	const errDialogRef = useRef<HTMLDialogElement | null>(null);
	const closeErrDialog = () => dispatch({ type: AppStateReducerActionType.DismissErrorModal });
  const onPhysicalKeyDown = (e: KeyboardEvent) => onKeyPress(e.key);
	const onKeyPress = (key: string): void => {
		if(gameState.finished || statsPopupIsShowing || morePopupIsShowing || gameState.errorMessage || !isKeyboardKey(key)) {
			return;
		}

		if(key === keyboardKeys.Enter) {
			if(gameState.guess.length === 5) {
				dispatch({ type: AppStateReducerActionType.SubmitGuess });
			}
		}
		else {
			dispatch({ type: AppStateReducerActionType.KeyPressed, key: key });
		}
	};

  useEffect(() => {
		window.addEventListener("keydown", onPhysicalKeyDown);

    return () => {
      window.removeEventListener("keydown", onPhysicalKeyDown);
    };
  }, []);

	useEffect(() => {
		if(gameState?.errorMessage) {
			errDialogRef.current?.showModal();
		} else {
			errDialogRef.current?.close();
		}
	}, [ gameState?.errorMessage ]);

  return (
		<div id="wordle-playground">
			<div id="page-layout">
				<Header onStatsButtonClicked={openStatsPopup} onMoreButtonClicked={openMorePopup} />

				<main>
					<GuessContainer previousGuessInfo={gameState.previousGuessInfo} guess={gameState.guess} finished={gameState.finished} />

					<Keyboard charStates={gameState.charStates} keyDownFunc={onKeyPress} />
				</main>

				{ statsPopupIsShowing && <StatsPopup close={closeStatsPopup} /> }
				{ morePopupIsShowing && <MorePopup close={closeMorePopup} /> }

				<dialog ref={errDialogRef} className="err-dialog">
					{ gameState.errorMessage }
					<br />
					<button onClick={closeErrDialog}>Close</button>
				</dialog>
			</div>
		</div>
  );
}
