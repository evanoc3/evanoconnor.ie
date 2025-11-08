import type { JSX } from "react";
import { CharState } from "../wordle.constants.ts";


interface Props {
  char: string;
  charState: CharState;
  keyDownFunc(char: string): void;
}


const enterKeyIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-down-left">
		<polyline points="9 10 4 15 9 20"/>
		<path d="M20 4v7a4 4 0 0 1-4 4H4"/>
	</svg>
);


const backspaceKeyIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-delete">
		<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
		<line x1="18" y1="9" x2="12" y2="15"/>
		<line x1="12" y1="9" x2="18" y2="15"/>
	</svg>
);


export function KeyboardKey(props: Props): JSX.Element {
	const specialKeyClass = (props.char === "Enter" || props.char === "Backspace")
		? "special-key"
		: "";
	
	return (
		<button
      className={`keyboard-key ${specialKeyClass} ${props.charState}`}
      onClick={() => props.keyDownFunc(props.char)}
      title={props.char}
    >
			{ (props.char === "Enter") && enterKeyIcon }
			{ (props.char === "Backspace") && backspaceKeyIcon }
			{ (props.char !== "Enter" && props.char !== "Backspace") && props.char }
		</button>
  );
};
