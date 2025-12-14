import type { KeyboardKey } from "../types/wordle-types.ts";

export const characters = {
	A: "a", B: "b", C: "c", D: "d", E: "e", F: "f", G: "g", H: "h", I: "i", J: "j", K: "k", L: "l", M: "m",
	N: "n", O: "o", P: "p", Q: "q", R: "r", S: "s", T: "t", U: "u", V: "v", W: "w", X: "x", Y: "y", Z: "z",
} as const;

export const keyboardKeys = {
	...characters,
	Enter: "Enter",
	Backspace: "Backspace",
} as const;

export enum CharacterState {
	UNKNOWN = "unknown",
	WRONG = "wrong",
	PARTIAL = "partial",
	CORRECT = "correct"
}

export const qwertyKeyboardLayout: KeyboardKey[][] = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"]
];

export enum AppStateReducerActionType {
  SetCurrentDay = "SetCurrentDay",
  GuessInputValueChanged = "GuessInputValueChanged",
  KeyPressed = "KeyPressed",
  SubmitGuess = "SubmitGuess",
  DismissErrorModal = "DismissErrorModal"
}
