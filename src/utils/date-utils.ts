import { DateTime, type DurationUnit } from "luxon";

/**
 * Singleton which stores the 'now' value at build-time. This can then be used to stringify and insert
 * into HTML templates.
 * 
 * Note, that it can't be used directly in client-side JS or it'll be re-evaluated at runtime. It needs to
 * be serialized into HTML and re-parsed with JS to work correctly.
 */
export const lastBuildTime = DateTime
  .now()
  .set({ millisecond: 0, second: 0 })
  .toUTC()
  .toISO({ suppressMilliseconds: true });

const timeUnitPairs: { minor?: DurationUnit, major: DurationUnit }[] = [
  {                   major: "seconds" },
  { minor: "seconds", major: "minutes" },
  { minor: "minutes", major: "hours" },
  { minor: "hours",   major: "days" },
  { minor: "days",    major: "months" },
  { minor: "months",  major: "years" },
];

export function getHumanReadableShortDuration(startDate: DateTime, endDate: DateTime): string {
  let humanReadableString = "now";

  const duration = endDate.diff(startDate);

  let significantUnits: DurationUnit[] | undefined;
  for(const timeUnitPair of timeUnitPairs) {
    if(duration.as(timeUnitPair.major) >= 1) {
      significantUnits = timeUnitPair.minor ? [timeUnitPair.minor, timeUnitPair.major]
                                            : [timeUnitPair.major];
    }
    else {
      break;
    }
  }

  if(significantUnits) {
    humanReadableString = duration
      .shiftTo(...significantUnits)
      .mapUnits((val, unit) => (significantUnits.includes(unit!) ? Math.floor(val) : 0))
      .toHuman({ listStyle: "long", showZeros: false });
  }

  return humanReadableString;
}
