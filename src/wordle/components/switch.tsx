import { useState, type JSX, type MouseEvent } from "react";

import "./switch.scss";

import { classnames } from "@/utils/class-utils";


interface Props {
  active?: boolean
  onChange?(newState: boolean): void;
}


export function Switch(props: Props): JSX.Element {
	const [isActive, setActive] = useState(props.active ?? false);

	function onChange(e: MouseEvent) {
		e.preventDefault();
		const newState = !isActive;
		setActive(newState);

		if(props.onChange) {
			props.onChange(newState);
		}
	}

	return (
		<button className={classnames("switch", { "active": isActive })} onClick={onChange} />
  );
}
