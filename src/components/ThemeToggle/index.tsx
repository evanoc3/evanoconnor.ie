"use client";

import { useState, useEffect } from "react";
import { Sun as FeatherSun, Moon as FeatherMoon } from "react-feather";


interface Props {
	buttonClassName?: string
	sunIconClassName?: string
	moonIconClassName?: string
}


export default function ThemeToggle({ buttonClassName, sunIconClassName, moonIconClassName }: Props): JSX.Element {
	const getCurrentTheme: () => "dark" | "light" = () => {
		if(typeof window === "undefined" || typeof document === "undefined") {
			return "light";
		}
		const userAgentTheme = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
		const pageTheme = document.body.getAttribute("data-theme") as "dark" | "light";
		return (pageTheme !== null) ? pageTheme : userAgentTheme;
	}

	const [ currentTheme, setCurrentTheme ] = useState<"dark" | "light">(getCurrentTheme());

	useEffect(() => {
		const updateCurrentTheme = () => {
			setCurrentTheme(getCurrentTheme());
		};

		const bodyObserver = new MutationObserver(() => {
			console.debug("pageTheme changed");
			updateCurrentTheme();
		});

		const userAgentThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const userAgentThemeChangeListener = () => {
			console.debug("userAgentTheme changed");
			updateCurrentTheme();
		};

		userAgentThemeMediaQuery.addEventListener("change", userAgentThemeChangeListener);
		bodyObserver.observe(document.body, { attributes: true });

		return () => {
			userAgentThemeMediaQuery.removeEventListener("change", userAgentThemeChangeListener);
			bodyObserver.disconnect();
		};
	}, []);

	const onClick = () => {
		if(typeof window === "undefined" || typeof document === "undefined") {
			return;
		}
		const userAgentTheme = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
		const newTheme = (getCurrentTheme() === "dark") ? "light" : "dark";

		if(newTheme === userAgentTheme) {
			document.body.removeAttribute("data-theme");
		}
		else {
			document.body.setAttribute("data-theme", newTheme);
		}
	};

	return (
		<button className={buttonClassName} onClick={onClick}>
			{
				(currentTheme === "dark") ? (
					<FeatherSun className={sunIconClassName}/>
				) : (
					<FeatherMoon className={moonIconClassName} />
				)
			}
		</button>
	);
}
