"use client";

import Link from "next/link";
import { Printer as PrinterSvg, ArrowLeft as ArrowLeftSvg } from "react-feather";
import styles from "./Toolbar.module.scss";
import ThemeToggle from "@/components/ThemeToggle";


interface Props {
	id?: string
	className?: string
}


export default function Toolbar({ id, className }: Props): JSX.Element {

	const onPrintButtonClicked = () => {
		if(typeof window === "undefined") {
			return;
		}
		window.print();
	}

	return (
		<div id={id} className={`${styles.toolbar} ${className}`}>
			<Link href="/" className={styles.toolbar_item}>
				<ArrowLeftSvg className={styles.icon} />
				Go Back
			</Link>

			<div id={styles.spacer} />

			<button className={styles.toolbar_item} onClick={onPrintButtonClicked}>
				<PrinterSvg className={styles.icon} />
				Print
			</button>

			<ThemeToggle
				buttonClassName={styles.toolbar_item}
				sunIconClassName={styles.sun_icon}
				moonIconClassName={styles.moon_icon}
			/>
		</div>
	);
}
