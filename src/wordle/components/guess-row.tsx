import type { JSX } from "react";

import "./guess-row.scss";

import { classnames } from "@/utils/class-utils.ts";
import type { CharacterState } from "../constants/wordle-constants.ts";
import type { Character } from "../types/wordle-types.ts";


type Props = Readonly<({
	guess: string;
	disabled: boolean;
	characterStates?: { character: Character, state: CharacterState }[]
})>;


export function GuessRow(props: Props): JSX.Element {
	return (
		<div className="guess-row">
			{
				Array.from({ length: 5 }).map((_, i) => (
					<span key={i} className={classnames("character-box", props.characterStates?.at(i)?.state)}>{props.guess.at(i)}</span>
				))
			}
		</div>
  );
}
