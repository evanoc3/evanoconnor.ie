import type { JSX } from "react";

import "./keyboard.scss";

import { CharacterState, qwertyKeyboardLayout } from "@/constants/wordle-constants.ts";
import { KeyboardKey } from "./index.ts";


type Props = Readonly<{
  charStates: Readonly<Record<string, CharacterState>>;
  keyDownFunc(char: string): void;
}>;


export function Keyboard(props: Props): JSX.Element {
  return (
    <section id="keyboard-container">
      <div className="keyboard-row">
        {
          qwertyKeyboardLayout[0].map(c => (
            <KeyboardKey key={c} char={c} charState={props.charStates[c]} keyDownFunc={props.keyDownFunc} />
          ))
        }
      </div>

      <div className="keyboard-row">
				{
					qwertyKeyboardLayout[1].map(c => (
						<KeyboardKey key={c} char={c} charState={props.charStates[c]} keyDownFunc={props.keyDownFunc} />
          ))
				}
			</div>

			<div className="keyboard-row">
        {
          qwertyKeyboardLayout[2].map(c => (
            <KeyboardKey key={c} char={c} charState={props.charStates[c]} keyDownFunc={props.keyDownFunc} />
          ))
        }
      </div>
    </section>
  );
}
