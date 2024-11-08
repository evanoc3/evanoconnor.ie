const MONTH_STRINGS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function shortMonth(date: Date): string {
	return MONTH_STRINGS[date.getMonth()];
}
