import Image from "next/image";
import { Linkedin as BootstrapLinkedinSvg, Github as BootstrapGithubSvg, Envelope as BootstrapEnvelopeSvg } from "react-bootstrap-icons";
import styles from "./HeroCell.module.scss";


export default function HeroCell(): JSX.Element {
	return (
		<header id={styles.hero_cell}>
			<div id={styles.grid}>
				<Image src="/me.jpg" width={88} height={88} alt="" id={styles.hero_img} />

				<h1 id={styles.title}>Evan O&apos;Connor</h1>

				<div id={styles.links_row}>
					<a
						href="https://www.linkedin.com/in/evanoc3/"
						title="Connect with me on LinkedIn at: https://www.linkedin.com/in/evanoc3/"
						target="_blank"
						rel="me noopener"
						className={styles.link}
					>
						<BootstrapLinkedinSvg className={styles.link_icon} />
						<span className={styles.link_text}>evanoc3</span>
					</a>

					<a
						href="https://github.com/evanoc3"
						title="Find me on GitHub at: https://github.com/evanoc3"
						target="_blank"
						rel="me noopener"
						className={styles.link}
					>
						<BootstrapGithubSvg className={styles.link_icon} />
						<span className={styles.link_text}>evanoc3</span>
					</a>

					<a
						href="mailto:evan@evanoconnor.ie"
						title="Email me at: evan@evanoconnor.ie"
						target="_blank"
						className={styles.link}
					>
						<BootstrapEnvelopeSvg className={styles.link_icon} />
						<span className={styles.link_text}>evan@evanoconnor.ie</span>
					</a>
				</div>
			</div>
		</header>
	);
}
