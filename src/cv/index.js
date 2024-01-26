"use strict";


/**
 * @param {Date} date
 * @return {string} 
 */
function getHumanReadableTimeInterval(date1, date2) {
  const monthsInYear = 12;

  const yearDiff = date2.getUTCFullYear() - date1.getUTCFullYear();
  const monthDiff = date2.getUTCMonth() - date1.getUTCMonth();

  let totalMonths = yearDiff * monthsInYear + monthDiff;

  const years = Math.floor(totalMonths / monthsInYear);
  const remainingMonths = totalMonths % monthsInYear;

  const yearString = years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '';
  const monthString = remainingMonths > 0 ? `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}` : '';

  return yearString + (years && remainingMonths ? ' ' : '') + monthString;
}


document.addEventListener("DOMContentLoaded", () => {
	const curJobStartDate = new Date("2021-09-01");
  const curTime = new Date();
	const curJobDuration = getHumanReadableTimeInterval(curJobStartDate, curTime);
	document.getElementById("current_work_duration").innerText = `(${curJobDuration})`;
});


document.getElementById("print_btn").addEventListener("click", () => {
	window.print();
});
