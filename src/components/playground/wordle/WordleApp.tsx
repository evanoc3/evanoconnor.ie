import { StrictMode, useEffect, useRef, useState, type JSX } from "react";
import "./WordleApp.scss";
import { defaultGameState, wordleGameService } from "./GameService.ts";
import { Header } from "./Header.tsx";
import { GuessContainer } from "./GuessRow/GuessContainer.tsx";
import { Keyboard } from "./Keyboard/Keyboard.tsx";
import { allLetters } from "./wordle.constants.ts";
import { StatsPopup } from "./StatsPopup.tsx";


export default function WordleAppWrapper(): JSX.Element {
  return (
    <StrictMode>
      <WordleApp />
    </StrictMode>
  );
}

function WordleApp(): JSX.Element {
  const gameService = useRef(wordleGameService);

	const [statsPopupIsShowing, setStatsPopupIsShowing] = useState(false);
	const [morePopupIsShowing, setMorePopupIsShowing] = useState(false);


  const [state, setState] = useState({
      ...defaultGameState
  });

  const onStatsButtonClicked = () => setStatsPopupIsShowing(true);
  const onMoreButtonClicked = () => setMorePopupIsShowing(true);
  const submitGuess = async () => {
		if(state.guess.length !== 5) {
			return
		}

		const resp = await fetch(`/api/validate?guess=${encodeURIComponent(state.guess)}`);
		if(!resp.ok) {
			console.error(resp.statusText);
			alert("Oops something went wrong. Please try again later");
			return;
		}

		const respBody = await resp.json();
		return respBody;
	};
  const updateCharacterInformation = (letters: any[]) => {
		const charStates = state.charStates;

		for(const letterInfo of letters) {
			charStates[letterInfo.guess] = letterInfo.state;
		}

		setState({
      ...state,
			charStates: charStates
		});

		return charStates;
	};
  const onPhysicalKeyDown = (e: KeyboardEvent) => {
		if(e.metaKey || state.finished || statsPopupIsShowing) {
			return;
		}

		e.preventDefault();

		if(allLetters.includes(e.key)) {
			if(state.guess.length < 5) {
				const newGuess = state.guess + e.key;
        setState({ ...state, guess: newGuess });
				gameService.current.updateCurrentGuess(newGuess);
			}
		}
		else if(e.key === "Backspace") {
			if(state.guess.length > 0) {
				const newGuess = state.guess.slice(0, state.guess.length - 1);
        setState({ ...state, guess: newGuess });
				gameService.current.updateCurrentGuess(newGuess);
			}
		}
		else if(e.key === "Enter") {
			if(state.guess.length === 5) {
				submitGuess().then(resp => {
					if(resp.error) {
						if(resp.error === "Word not recognised") {
							alert(resp.error);
						}
						else {
							console.error(resp.error);
						}
					}

					if(resp.error === "") {
						setState({
              ...state,
							previousGuessInfo: [...state.previousGuessInfo, resp],
							guess: "",
							finished: resp.isCorrect
						});

						const newCharStates = updateCharacterInformation(resp.letters);

						gameService.current.addGuessInfo(resp, newCharStates, resp.isCorrect);
					}
				});
			}
		}
	};
  const onVirtualKeyDown = (char: string): void => {
		const fakeKeyDownEvent = {
			key: char,
			preventDefault: () => {}
		} as KeyboardEvent;
		onPhysicalKeyDown(fakeKeyDownEvent);
	};

  useEffect(() => {
		window.addEventListener("keydown", onPhysicalKeyDown);

    return () => {
      window.removeEventListener("keydown", onPhysicalKeyDown);
    };
  }, []);

  return (
    <div id="wordle-playground">
      <div id="page-layout">
        <Header onStatsButtonClicked={onStatsButtonClicked} onMoreButtonClicked={onMoreButtonClicked} />

        <main>
          <GuessContainer previousGuessInfo={state.previousGuessInfo} guess={state.guess} submitFunc={submitGuess} finished={state.finished} />

          <Keyboard charStates={state.charStates} keyDownFunc={onVirtualKeyDown} />
        </main>

        <StatsPopup showing={statsPopupIsShowing} setShowingFunc={setStatsPopupIsShowing} />
      </div>
    </div>
  );
}
