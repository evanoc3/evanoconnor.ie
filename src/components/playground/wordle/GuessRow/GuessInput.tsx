import type { JSX } from "react";

interface Props {
  state?: string;
  char?: string;
  disabled: boolean;
}

export function GuessInput(props: Props): JSX.Element {
  return (
		<input
      maxLength={1}
      inputMode="none"
      className={`letter-input ${props.state ?? ""}`}
      value={props.char}
      disabled={props.disabled}
    />
  );
}