import { useMemo } from "react";
import Image from "next/image";
import styles from "./ExperienceItem.module.scss";
import { shortMonth } from "@/utils/date_utils";


const NDASH = "\u2013";


interface Props {
	image: string
	title: string
	location: { text: string, link: string }
	duration: { started: Date, ended?: Date, yearsOnly?: boolean }
	description: React.ReactNode
	badges: { text: string, link?: string }[]
}


export default function ExperienceItem(props: Props): JSX.Element {
	const isImageSvg = useMemo(() => {
		return props.image.endsWith(".svg");
	}, [ props.image ]);

	const durationText = useMemo(() => {
		let startText: string;
		if(props.duration.yearsOnly) {
			startText = `${props.duration.started.getFullYear()}`;
		} else {
			startText = `${shortMonth(props.duration.started)} ${props.duration.started.getFullYear()}`;
		}

		let endText: string;
		if(props.duration.ended !== undefined) {
			if(props.duration.yearsOnly) {
				endText = `${props.duration.ended.getFullYear()}`;
			} else {
				endText = `${shortMonth(props.duration.ended)} ${props.duration.ended.getFullYear()}`;
			}
		} else {
			endText = "Present";
		}

		return `${startText} ${NDASH} ${endText}`;
	}, [ props.duration.started, props.duration.ended, props.duration.yearsOnly ]);

	return (
		<div className={styles.container}>
			<Image src={props.image} width={48} height={48} alt="" className={styles.image} unoptimized={isImageSvg} />
			
			<h3 className={styles.title}>{ props.title }</h3>

			<div className={styles.bullet}>&bull;</div>

			<div className={styles.location}>
				<a
					href={props.location.link}
					className={styles.location_link}
					target="_blank"
					rel="noopener noreferrer"
				>
					{ props.location.text }
				</a>
			</div>

			<div className={styles.duration}>
				{/* TODO: add tooltip with further explanation of duration */}
				{ durationText }
			</div>

			<div className={styles.description_container}>
				{ props.description }
			</div>

			<ul className={styles.badges_container}>
				{ 
					props.badges.map(badge => (
						<li key={badge.text}>
							<a
								href={badge.link}
								className={styles.badge}
								target="_blank"
								rel="noopener noreferrer"
							>
								{ badge.text }
							</a>
						</li>
					))
				}
			</ul>
		</div>
	);
}
