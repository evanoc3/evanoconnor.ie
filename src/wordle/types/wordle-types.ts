import type { CharacterState, characters, keyboardKeys } from "../constants/wordle-constants.ts";

type Characters = typeof characters;
export type Character = Characters[keyof Characters];

type KeyboardKeys = typeof keyboardKeys;
export type KeyboardKey = KeyboardKeys[keyof KeyboardKeys];

export interface PreviousGuessInfo {
  timestamp: string;
  guess: string;
  isCorrect: boolean;
  letters: { character: Character, state: CharacterState }[];
}

export interface GameState {
  previousGuessInfo: PreviousGuessInfo[];
  guess: string;
  charStates: Record<Character, CharacterState>;
  finished: boolean;
  targetWord: string;
  errorMessage?: string;
}

export interface AppState {
  currentDay: number;
  gameStates: Record<number, GameState | undefined>;
}
