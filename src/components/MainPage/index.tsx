import type { PropsWithChildren } from "react";
import styles from "./MainPage.module.scss";
import "./MainPage.scss";


export default function MainPage({ children }: PropsWithChildren): JSX.Element {
	return (
		<main id={styles.main}>
			{ children }
		</main>
	);
}
