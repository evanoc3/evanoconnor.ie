import styles from "./SectionTitle.module.scss";


interface Props {
	text: string
}


export default function SectionTitle({ text }: Props): JSX.Element {
	return (
		<header className={styles.container}>
			<hr className={styles.line} />

			<h2 className={styles.title}>{ text }</h2>

			<hr className={styles.line} />
		</header>
	);
}
