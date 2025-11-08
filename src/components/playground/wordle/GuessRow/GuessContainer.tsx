import type { JSX } from "react";
import { GuessRow } from "./GuessRow.tsx";
import type { PreviousGuessInfo } from "../wordle.types.ts";


interface Props {
  previousGuessInfo: PreviousGuessInfo[];
  guess: string;
  finished: boolean;
  submitFunc(): void;
}


export function GuessContainer(props: Props): JSX.Element {
  const { previousGuessInfo, guess, finished } = props;
  return (
    <section id="guesses-container">
      {
        previousGuessInfo.map(previousGuessInfo => (
          <GuessRow key={JSON.stringify(previousGuessInfo)} disabled={true} previousGuessInfo={previousGuessInfo} />
        ))
      }

      {
        (previousGuessInfo.length < 6) && (
          <GuessRow guess={guess} disabled={finished} />
        )
      }

      {
        Array.from({ length: 6 - previousGuessInfo.length - 1 }).map((_, i) => (
          <GuessRow key={i} guess="" disabled />
        ))
      }
    </section>
  );
}
