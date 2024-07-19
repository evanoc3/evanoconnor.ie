"use strict";

/**
 * Takes in two dates and returns a string containing the most significant unit of time between them, e.g. "2 months", or "1 year".
 * Note that this function only handles years and months and is not designed to handle smaller units of time such as days, hours or minutes.
 * 
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @returns {string} 
 */
function getHumanReadableTimeInterval(dateFrom, dateTo) {
  const monthsInYear = 12;

  const yearDiff = dateTo.getUTCFullYear() - dateFrom.getUTCFullYear();
  const monthDiff = dateTo.getUTCMonth() - dateFrom.getUTCMonth();

  let totalMonths = yearDiff * monthsInYear + monthDiff;

  const years = Math.floor(totalMonths / monthsInYear);
  const remainingMonths = totalMonths % monthsInYear;

  const yearString = years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '';
  const monthString = remainingMonths > 0 ? `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}` : '';

  return yearString + (years && remainingMonths ? ' ' : '') + monthString;
}


/**
 * Dynamically calculates the length of time i've been at my current job as a human readable string and sets it as the tooltip for the label.
 * 
 * @returns {void}
 */
function setCurrentJobDuration() {
	const curJobStartDate = new Date("2021-09-01");
  const curTime = new Date();
  const curMonthName = curTime.toLocaleString("default", { month: "short" });
	const curJobDuration = getHumanReadableTimeInterval(curJobStartDate, curTime);
	document.getElementById("current-work-item__duration").setAttribute("title", `Sep 2021 – ${curMonthName} ${curTime.getUTCFullYear()} (${curJobDuration})`);
}


/**
 * Checks to see if the browser javascript engine supports CSS media query matching and whether it prefers light/dark theme.
 * Returns the theme the browser prefers or undefined if matchMedia is not supported in the browser.
 * 
 * @returns {"light" | "dark" | undefined} 
 */
function getCurrentBrowserTheme() {
  if (window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return undefined;
}


/**
 * Checks the browser's localStorage cache to see if there is a previously set preference for theme. 
 * 
 * @returns {"light" | "dark" | undefined}
 */
function getCurrentThemeFromLocalStorage() {
  if (window.localStorage) {
    const themePreference = window.localStorage.getItem("/cv/ prefers-color-scheme");
    if (["light", "dark"].includes(themePreference)) {
      return themePreference;
    }
  }

  return undefined;
}


/**
 * Toggles the current theme of the document using the data-theme attribute on the body.
 * Reads the current theme from the same attribute if present, or from the CSS prefers-color-scheme media query if not.
 * 
 * @returns {void}
 */
function onThemeButtonClicked() {
  const currentBrowserTheme = getCurrentBrowserTheme();
  const bodyHasThemeAttribute = document.body.dataset.theme !== undefined;
  const themeAttribute = document.body.dataset.theme;
  let newThemeAttribute = "dark";

  if (!bodyHasThemeAttribute) {
    newThemeAttribute = (currentBrowserTheme === "light") ? "dark" : "light";
  }
  else {
    newThemeAttribute = (themeAttribute === "light") ? "dark" : "light";
  }

  if (window.localStorage) {
    if (getCurrentBrowserTheme() === newThemeAttribute) {
      window.localStorage.removeItem("/cv/ prefers-color-scheme");
    }
    else {
      window.localStorage.setItem("/cv/ prefers-color-scheme", newThemeAttribute);
    }
  }

  document.body.dataset.theme = newThemeAttribute;
}


/**
 * Do various things once the page has loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  setCurrentJobDuration();

  // setup print button
  document.getElementById("print-btn").classList.add("visible");
  document.getElementById("print-btn").addEventListener("click", () => window.print());

  // setup theme button
  document.getElementById("theme-btn").classList.add("visible");
  document.getElementById("theme-btn").addEventListener("click", onThemeButtonClicked);
  const initialTheme = getCurrentThemeFromLocalStorage() ?? getCurrentBrowserTheme();
  if (initialTheme) {
    document.body.dataset.theme = initialTheme;
  }
});
