import type { JSX } from "react";

import "./more-popup.scss";

import { PopupBase, Switch } from "./index.ts";


type Props = Readonly<{
	close(): void;
}>;


export function MorePopup(props: Props): JSX.Element {
	return (
		<PopupBase close={props.close} id="more-popup">
			<h2>More</h2>
			<Switch active={false} onChange={() => {}} /> Hard Mode
		</PopupBase>
  );
};
