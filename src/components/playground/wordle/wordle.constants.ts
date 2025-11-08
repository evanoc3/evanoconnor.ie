export const allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

export const qwertyLayout = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
														 ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
														 ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"]];

export enum CharState {
	UNKNOWN = "unknown",
	WRONG = "wrong",
	PARTIAL = "partial",
	CORRECT = "correct"
}