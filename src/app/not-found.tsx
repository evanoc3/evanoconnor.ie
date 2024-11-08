import Link from "next/link";
import styles from "./not-found.module.scss";


export default function NotFoundPage(): JSX.Element {
	return (
		<div id={styles.not_found_page}>
			<h1>Oops</h1>

			<br />
			
			<p>That page was not found.</p>

			<br />

			<Link href="/">&larr; go back</Link>
		</div>
	);
}
