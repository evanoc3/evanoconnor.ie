import type { JSX } from "react";
import { qwertyLayout, CharState } from "../wordle.constants.ts";
import { KeyboardKey } from "./KeyboardKey.tsx";


interface Props {
  charStates: Readonly<Record<string, CharState>>;
  keyDownFunc(char: string): void;
}


export function Keyboard(props: Props): JSX.Element {
  return (
    <section id="keyboard-container">
      <div className="keyboard-row">
        {
          qwertyLayout[0].map(c => (
            <KeyboardKey key={c} char={c} charState={props.charStates[c]} keyDownFunc={props.keyDownFunc} />
          ))
        }
      </div>

      <div className="keyboard-row">
				{
					qwertyLayout[1].map(c => (
						<KeyboardKey key={c} char={c} charState={props.charStates[c]} keyDownFunc={props.keyDownFunc} />
          ))
				}
			</div>

			<div className="keyboard-row">
        {
          qwertyLayout[2].map(c => (
            <KeyboardKey key={c} char={c} charState={props.charStates[c]} keyDownFunc={props.keyDownFunc} />
          ))
        }
      </div>
    </section>
  );
}
