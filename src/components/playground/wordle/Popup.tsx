import type { JSX, MouseEvent, PropsWithChildren } from "react";
import { useEffect } from "react";


type Props = PropsWithChildren<{
  id: string;
  showing: boolean;
  setShowingFunc(showing: boolean): void;
}>;


const closeIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
		<line x1="18" y1="6" x2="6" y2="18"></line>
		<line x1="6" y1="6" x2="18" y2="18"></line>
	</svg>
);


export function Popup(props: Props): JSX.Element {
	function close() {
		props.setShowingFunc(false);
	}

	function onKeyDown(e: KeyboardEvent): void {
		if(e.key === "Escape" && props.showing) {
			props.setShowingFunc(false);
		}
	}

	function onPopupClick(e: MouseEvent): void {
		e.stopPropagation();
	}

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	return (
		<div className={`popup-background ${props.showing ? "showing" : ""}`} onClick={close}>
			<div className="popup" onClick={onPopupClick} id={props.id}>
				<button className="popup-close-button" onClick={close} title="close">
					{ closeIcon }
				</button>
				
				{ props.children }
			</div>
		</div>
  );
}
