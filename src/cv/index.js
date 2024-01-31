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


/* Add the duration in current job to label */
document.addEventListener("DOMContentLoaded", () => {
  setCurrentJobDuration();
});


/* Set event handler for print button */
document.getElementById("print_btn").addEventListener("click", () => {
	window.print();
});
