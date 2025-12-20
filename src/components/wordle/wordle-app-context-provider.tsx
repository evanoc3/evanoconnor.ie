import { produce } from "immer";
import { createContext, useContext, useReducer, type ActionDispatch, type JSX, type PropsWithChildren } from "react";

import { AppStateReducerActionType, CharacterState, keyboardKeys } from "@/constants/wordle-constants.ts";
import wordleGameService from "@/services/wordle-game-service.ts";
import type { AppState, Character, GameState, KeyboardKey } from "@/types/wordle-types.ts";


const AppStateContext = createContext<AppState>(wordleGameService.defaultAppState);
const AppStateReducerContext = createContext<ActionDispatch<[AppStateReducerAction]>>(() => {});


export function WordleAppContextProvider(props: Readonly<PropsWithChildren<{}>>): JSX.Element {
  const [appState, dispatch] = useReducer(appStateReducer, wordleGameService.fetchPersistedAppState() ?? wordleGameService.defaultAppState);
  return (
    <AppStateContext.Provider value={appState}>
      <AppStateReducerContext.Provider value={dispatch}>
        { props.children }
      </AppStateReducerContext.Provider>
    </AppStateContext.Provider>
  );
}

type AppStateReducerAction = {
  type: AppStateReducerActionType.SetCurrentDay,
  newCurrentDay: number
} | {
  type: AppStateReducerActionType.KeyPressed,
  key: KeyboardKey
} | {
  type: AppStateReducerActionType.SubmitGuess |
        AppStateReducerActionType.DismissErrorModal
};


function appStateReducer(prevAppState: AppState, action: AppStateReducerAction): AppState {
  let newAppState: AppState;

  switch(action.type) {
    case AppStateReducerActionType.SetCurrentDay: {
      wordleGameService.setCurrentDay(action.newCurrentDay);
      newAppState = produce(prevAppState, (draft) => {
        draft.currentDay = action.newCurrentDay;
        draft.gameStates[draft.currentDay] = wordleGameService.defaultGameState;
      });
      break;
    }

    case AppStateReducerActionType.KeyPressed: {
      newAppState = produce(prevAppState, (draft) => {
        const currentGuess = draft.gameStates[draft.currentDay]!.guess 
        if(action.key === keyboardKeys.Backspace) {
          draft.gameStates[draft.currentDay]!.guess = currentGuess.slice(0, -1);
        }
        else if(currentGuess.length < 5) {
          draft.gameStates[draft.currentDay]!.guess = currentGuess + action.key;
        }
      });
      break;
    }
    
    case AppStateReducerActionType.SubmitGuess: {
      newAppState = produce(prevAppState, (draft) => {
        const currentGameState = draft.gameStates[draft.currentDay]!;
        const guessedWord = currentGameState.guess;
        if(guessedWord.length !== 5) {
          currentGameState.errorMessage = `Invalid word length (${guessedWord.length}). Must be 5.`;
          return;
        }

        if(!wordleGameService.wordExistsInDictionary(guessedWord)) {
          currentGameState.errorMessage = "Word not recognised";
          return;
        }

        currentGameState.guess = "";

        const { targetWord } = currentGameState;
        const guessCharacters = guessedWord.split("") as Character[];

        const guessCharacterStates = guessCharacters.map(guessCharacter => ({ character: guessCharacter, state: CharacterState.UNKNOWN }));
        for(let i = 0; i < guessCharacters.length; i++) {
          const guessCharacter = guessCharacters[i];
          if(guessCharacter === targetWord[i]) {
            guessCharacterStates[i].state = CharacterState.CORRECT;
          } else if(targetWord.includes(guessCharacter)) {
            guessCharacterStates[i].state = CharacterState.PARTIAL;
          } else {
            guessCharacterStates[i].state = CharacterState.WRONG;
          }
        }

        for(const { character, state } of guessCharacterStates) {
          if(currentGameState.charStates[character] !== CharacterState.CORRECT) {
            currentGameState.charStates[character] = state;
          }
        }

        const isGuessCorrect = guessedWord === currentGameState.targetWord;

        currentGameState.previousGuessInfo.push({
          timestamp: new Date().toISOString(),
          guess: guessedWord,
          isCorrect: isGuessCorrect,
          letters: guessCharacterStates
        });

        currentGameState.finished = isGuessCorrect || currentGameState.previousGuessInfo.length >= 5;
      });
      break;
    }

    case AppStateReducerActionType.DismissErrorModal: {
      newAppState = produce(prevAppState, (draft) => {
        draft.gameStates[draft.currentDay]!.errorMessage = undefined;
      });
    }
  }

  wordleGameService.persistAppState(newAppState);
  return newAppState;
}


export function useAppState(): AppState {
  return useContext(AppStateContext);
}

export function useAppStateReducer(): ActionDispatch<[AppStateReducerAction]> {
  return useContext(AppStateReducerContext);
}

export function useCurrentGameState(): GameState {
  const appState = useAppState();
  return appState.gameStates[appState.currentDay] ?? wordleGameService.defaultGameState;
}
