import { DateTime, type DurationUnit } from "luxon";

export const lastBuildTime = DateTime
  .now()
  .toUTC()
  .set({ millisecond: 0, second: 0 })
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
      .rescale()
      .toHuman({ listStyle: "long" /* , maximumFractionDigits: 0 */ });
  }

  return humanReadableString;
}
