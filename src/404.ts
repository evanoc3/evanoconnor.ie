"use strict";

/**
 * Runs after all HTML and scripts are loaded.
 */
window.addEventListener("DOMContentLoaded", () => {
	const slug = window.location.pathname;

	const notFoundPathLabel = document.querySelector("#not-found-path")!;

	const missingMessage = (slug === "/404.html" || slug === "/404") ? "page" : `path ${slug}`;
	notFoundPathLabel.textContent = missingMessage;
});
