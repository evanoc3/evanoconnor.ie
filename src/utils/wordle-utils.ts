import { characters, keyboardKeys } from "@/constants/wordle-constants.ts";
import type { Character, KeyboardKey } from "@/types/wordle-types.ts";


export function isCharacter(c: string): c is Character {
  return Object.values<string>(characters).includes(c);
}

export function isKeyboardKey(k: string): k is KeyboardKey {
  return Object.values<string>(keyboardKeys).includes(k);
}

export function isSpecialKeyboardKey(k: KeyboardKey): boolean {
  return k === keyboardKeys.Enter || k === keyboardKeys.Backspace;
}
