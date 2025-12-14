import { type JSX, type MouseEvent, type PropsWithChildren, useEffect } from "react";

import XSvg from "feather-icons/dist/icons/x.svg?react";
import "./popup-base.scss";


type Props = Readonly<PropsWithChildren<{
  id: string;
  close(): void;
}>>;


export function PopupBase(props: Props): JSX.Element {
	const onKeyDown = (e: KeyboardEvent) => {
		if(e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			props.close();
		}
	};

	const onPopupClick = (e: MouseEvent) => e.stopPropagation();

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	return (
		<div className="popup-background" onClick={props.close}>
			<div className="popup" onClick={onPopupClick} id={props.id}>
				<button className="popup-close-button" onClick={close} title="close">
					<XSvg />
				</button>
				
				{ props.children }
			</div>
		</div>
  );
}
