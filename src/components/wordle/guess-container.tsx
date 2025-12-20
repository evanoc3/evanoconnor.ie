import type { JSX } from "react";

import "./guess-container.scss";

import type { PreviousGuessInfo } from "@/types/wordle-types.ts";
import { GuessRow } from "./index.ts";


type Props = Readonly<{
  previousGuessInfo: PreviousGuessInfo[];
  guess: string;
  finished: boolean;
}>;


export function GuessContainer(props: Props): JSX.Element {
  const { previousGuessInfo, guess, finished } = props;
  return (
    <section id="guesses-container">
      {
        previousGuessInfo.map((previousGuessInfo) => (
          <GuessRow guess={previousGuessInfo.guess} key={JSON.stringify(previousGuessInfo)} characterStates={previousGuessInfo.letters} disabled />
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
