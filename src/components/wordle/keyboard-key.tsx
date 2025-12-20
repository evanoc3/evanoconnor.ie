import type { JSX } from "react";

import CornerDownLeftSvg from "feather-icons/dist/icons/corner-down-left.svg?react";
import DeleteSvg from "feather-icons/dist/icons/delete.svg?react";
import "./keyboard-key.scss";

import { CharacterState, keyboardKeys } from "#/constants/wordle-constants.ts";
import type { KeyboardKey as KeyboardKeyType } from "#/types/wordle-types.ts";
import { classnames } from "#/utils/class-utils.ts";
import { isSpecialKeyboardKey } from "#/utils/wordle-utils.ts";


type Props = Readonly<{
  char: KeyboardKeyType;
  charState: CharacterState;
  keyDownFunc(char: string): void;
}>;


export function KeyboardKey(props: Props): JSX.Element {
	return (
		<button
      className={classnames("keyboard-key", props.charState, { "special-key": isSpecialKeyboardKey(props.char) })}
      onClick={() => props.keyDownFunc(props.char)}
      title={props.char}
    >
			{
				(props.char === keyboardKeys.Enter)
					? <CornerDownLeftSvg />
				: (props.char === keyboardKeys.Backspace)
					? <DeleteSvg />
				: props.char
			}
		</button>
  );
};
