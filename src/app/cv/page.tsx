import type { Metadata } from "next";
import styles from "./page.module.scss";
import MainPage from "@/components/MainPage";
import Toolbar from "@/components/Toolbar";
import HeroCell from "@/components/HeroCell";
import SectionTitle from "@/components/SectionTitle";
import ExperienceItem from "@/components/ExperienceItem";


export const metadata: Metadata = {
  title: "CV - Evan O'Connor"
};


export default function CvPage(): JSX.Element {
	return (
		<div id={styles.cv_page}>
			<Toolbar id={styles.toolbar} />

			<MainPage>
				<div id={styles.page_layout}>
					<HeroCell />

					<SectionTitle text="Work" />

					<ExperienceItem
						image="/wxcc.png"
						title="Software Engineer"
						location={{
							text: "Contact Center (Cisco)",
							link: "https://www.webex.com/us/en/products/customer-experience/contact-center.html"
						}}
						duration={{
							started: new Date("2024-03-01")
						}}
						description={(
							<p>
								Currently working on improving the quality, reliability, and feature velocity of Webex Contact Center.
							</p>
						)}
						badges={[
							{ text: "CSS", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
							{ text: "Git", link: "" },
							{ text: "HTML", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
							{ text: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
							{ text: "Jest", link: "https://jestjs.io/" },
							{ text: "Node.js", link: "https://nodejs.org" },
							{ text: "React", link: "https://react.dev" },
							{ text: "Sass", link: "https://sass-lang.com" },
							{ text: "TypeScript", link: "https://www.typescriptlang.org/" }
						]}
					/>

					<ExperienceItem
						image="/webex.svg"
						title="Software Engineer"
						location={{
							text: "Webex (Cisco)",
							link: "https://webex.com/"
						}}
						duration={{
							started: new Date("2021-09-01"),
							ended: new Date("2024-03-01")
						}}
						description={(
							<>
								<p>
									Improved the Webex desktop apps&apos; reliability and performance by fixing bugs & servicing tech debt.
								</p>
								<p>
									Delivered high-quality features from the product roadmap (along with some independently driven personal projects during hackathons) in a collaborative, fast-paced work environment.
								</p>
								<p>
									Held sole responsibility for important business workflows such as: localization of the apps, & publication of version release notes.
								</p>
							</>
						)}
						badges={[
							{ text: "C++", link: "https://isocpp.org" },
							{ text: "CMake", link: "https://cmake.org" },
							{ text: "Git", link: "https://git-scm.com" },
							{ text: "Python", link: "https://www.python.org" },
							{ text: "QML", link: "https://doc.qt.io/qt-6/qmlapplications.html" },
							{ text: "Qt", link: "https://www.qt.io/product" },
							{ text: "SQLite", link: "https://www.sqlite.org/index.html" },
							{ text: "Swift", link: "https://www.swift.org" },
							{ text: "ZSH", link: "https://www.zsh.org" }
						]}
					/>

					<ExperienceItem
						image="/webex.svg"
						title="Software Engineering Intern"
						location={{
							text: "Webex (Cisco)",
							link: "https://webex.com/"
						}}
						duration={{
							started: new Date("2020-01-01"),
							ended: new Date("2020-09-01")
						}}
						description={(
							<p>
								Worked on the desktop clients teams at Webex, with a particular focus on: Accessibility (keyboard navigation, screen-reader, localization, RTL, etc…), theming, & creating a library of reusable UI components.
							</p>
						)}
						badges={[
							{ text: "C++", link: "https://isocpp.org" },
							{ text: "Git", link: "https://git-scm.com" },
							{ text: "Qt", link: "https://www.qt.io/product" },
							{ text: "Swift", link: "https://www.swift.org" },
							{ text: "ZSH", link: "https://www.zsh.org" }
						]}
					/>

					<SectionTitle text="Education" />

					<ExperienceItem
						image="/university_of_galway.png"
						title="BSc Computer Science & IT"
						location={{
							text: "University of Galway",
							link: "https://www.universityofgalway.ie/courses/undergraduate-courses/computer-science-and-information-technology.html"
						}}
						duration={{
							started: new Date("2017-09-01"),
							ended: new Date("2021-06-01"),
							yearsOnly: true
						}}
						description={(
							<p>
								Graduated from the University of Galway with first-class honours in a Bachelor&apos;s degree in Computer Science & Information Technology. 
							</p>
						)}
						badges={[
							{ text: "C", link: "https://en.wikipedia.org/wiki/The_C_Programming_Language" },
							{ text: "C#", link: "https://dotnet.microsoft.com/en-us/languages/csharp" },
							{ text: "CSS", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
							{ text: "HTML", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
							{ text: "Java", link: "https://www.java.com/en/" },
							{ text: "JavaScript", link: "https://developer.mozilla.org/en-US/docs/Web/javascript" },
							{ text: "Lisp", link: "https://racket-lang.org/" },
							{ text: "Linux", link: "https://www.linux.org/" },
							{ text: "MATLAB", link: "https://www.mathworks.com/products/matlab.html" },
							{ text: "MySQL", link: "https://www.mysql.com/" },
							{ text: "Node.js", link: "https://nodejs.org/en" },
							{ text: "PHP", link: "https://www.php.net" },
							{ text: "Prolog", link: "https://www.swi-prolog.org/" },
							{ text: "React", link: "https://react.dev" },
							{ text: "Typescript", link: "https://www.typescriptlang.org" },
							{ text: "ZSH", link: "https://www.zsh.org" }
						]}
					/>
				</div>
			</MainPage>
		</div>
	);
}
