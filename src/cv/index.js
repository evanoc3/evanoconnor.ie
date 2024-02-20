"use strict";


/**
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @return {string} 
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


function setCurrentJobDuration() {
	const curJobStartDate = new Date("2021-09-01");
  const curTime = new Date();
  const curMonthName = curTime.toLocaleString("default", { month: "short" });
	const curJobDuration = getHumanReadableTimeInterval(curJobStartDate, curTime);
	document.getElementById("current-work-item__duration").setAttribute("title", `Sep 2021 – ${curMonthName} ${curTime.getUTCFullYear()} (${curJobDuration})`);
}


/**
 * Checks to see if the browser javascript engine supports CSS media query matching and whether it prefers light/dark theme.
 * Returns the theme the browser prefers or "light" by default.
 * @return {"light" | "dark"} 
 */
function getCurrentBrowserTheme() {
  return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
}


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

  document.body.dataset.theme = newThemeAttribute;
}


/* Add the duration in current job to label */
document.addEventListener("DOMContentLoaded", () => {
  setCurrentJobDuration();

  // setup print button
  document.getElementById("print-btn").classList.add("visible");
  document.getElementById("print-btn").addEventListener("click", () => window.print());

  // setup theme button
  document.getElementById("theme-btn").classList.add("visible");
  document.getElementById("theme-btn").addEventListener("click", onThemeButtonClicked);
  document.body.dataset.theme = getCurrentBrowserTheme();
});
