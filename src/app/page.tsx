import type { Metadata } from "next";
import styles from "./page.module.scss";


export const metadata: Metadata = {
  title: "Home - Evan O'Connor"
};


export default function Home(): JSX.Element {
  return (
    <div id={styles.page}>
      <h1>Hello!</h1>
      <br />
      <p>
        I&apos;m Evan O&apos;Connor, a software engineer currently working at Cisco in Galway, Ireland.
        <br />
        Thanks for visiting my website!
      </p>

      <br />
      <br />

      <strong>See also:</strong>
      <ul>
        <li><a href="./cv" style={{color: "blue", textDecoration: "underline"}}>CV</a></li>
      </ul>
    </div>
  );
}
