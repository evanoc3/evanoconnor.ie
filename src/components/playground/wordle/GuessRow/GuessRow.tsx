import type { JSX } from "react";
import { GuessInput } from "./GuessInput.tsx";
import type { PreviousGuessInfo } from "../wordle.types.ts";


type Props = {
  disabled: boolean;
} & (
  { guess: string } |
  { previousGuessInfo: PreviousGuessInfo; }
);


export function GuessRow(props: Props): JSX.Element {
	// if props.charStates is defined, then this is a readonly row presenting information about a previous guess
	if ("previousGuessInfo" in props) {
		return (
			<div className="guess-row">
				{
					props.previousGuessInfo.letters.map(l => (
            <GuessInput disabled char={l.guess} state={l.state} />
          ))
				}
			</div>
    );
	}

	// otherwise, it might be an editable row
	return (
		<div className="guess-row">
			{
				Array.from(props.guess).map(c => (
					<GuessInput disabled char={c} />
        ))
			}

			{
        (props.guess.length < 5) && (
          <GuessInput disabled={props.disabled} />
        )
      }

			{ 
        (props.guess.length + 1 < 5) && (
					Array.from(Array(5 - props.guess.length - 1)).map(() => (
						<GuessInput disabled />
          ))
				)
			}
		</div>
  );
}
