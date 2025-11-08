import type { CharState } from "./wordle.constants.ts";


export interface PreviousGuessInfo {
  timestamp: string;
  error: string;
  guess: string;
  isCorrect: boolean;
  letters: { guess: string, state: CharState }[];
}


export interface GameState {
  previousGuessInfo: PreviousGuessInfo[];
  guess: string;
  charStates: Record<string, CharState>;
  finished: boolean;
}