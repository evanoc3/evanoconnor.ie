import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { getHumanReadableShortDuration } from "@/utils/date-utils";

describe("date-utils", () => {

  describe("getHumanReadableShortDuration()", () => {
    const start = "2025-07-07T12:00:00Z";

    it.each([
      { testTitle: "returns 'now' when start/end time are the same",            start,                         end: start,                      expected: "now" },
      { testTitle: "returns 'now' (ignoring milliseconds)",                     start,                         end: "2025-07-07T12:00:00.123Z", expected: "now" },
      { testTitle: "returns '1 second'",                                        start,                         end: "2025-07-07T12:00:01Z",     expected: "1 second" },
      { testTitle: "returns '2 seconds'",                                       start,                         end: "2025-07-07T12:00:02Z",     expected: "2 seconds" },
      { testTitle: "returns '3 seconds' (ignoring milliseconds)",               start,                         end: "2025-07-07T12:00:03.456Z", expected: "3 seconds" },
      { testTitle: "returns '1 minute'",                                        start,                         end: "2025-07-07T12:01:00Z",     expected: "1 minute" },
      { testTitle: "returns '2 minutes'",                                       start,                         end: "2025-07-07T12:02:00Z",     expected: "2 minutes" },
      { testTitle: "returns '3 minutes and 1 second'",                          start,                         end: "2025-07-07T12:03:01Z",     expected: "3 minutes and 1 second" },
      { testTitle: "returns '4 minutes and 2 seconds'",                         start,                         end: "2025-07-07T12:04:02Z",     expected: "4 minutes and 2 seconds" },
      { testTitle: "returns '5 minutes and 3 seconds' (ignoring milliseconds)", start,                         end: "2025-07-07T12:05:03.456Z", expected: "5 minutes and 3 seconds" },
      { testTitle: "returns '1 hour'",                                          start,                         end: "2025-07-07T13:00:00Z",     expected: "1 hour" },
      { testTitle: "returns '2 hours and 1 minute'",                            start,                         end: "2025-07-07T14:01:00Z",     expected: "2 hours and 1 minute" },
      { testTitle: "returns '3 hours and 2 minutes'",                           start,                         end: "2025-07-07T15:02:00Z",     expected: "3 hours and 2 minutes" },
      { testTitle: "returns '4 hours and 3 minutes' (ignoring seconds)",        start,                         end: "2025-07-07T16:03:21Z",     expected: "4 hours and 3 minutes" },
      { testTitle: "returns '1 day'",                                           start,                         end: "2025-07-08T12:00:00Z",     expected: "1 day" },
      { testTitle: "returns '2 days'",                                          start,                         end: "2025-07-09T12:00:00Z",     expected: "2 days" },
      { testTitle: "returns '3 days and 1 hour'",                               start,                         end: "2025-07-10T13:00:00Z",     expected: "3 days and 1 hour" },
      { testTitle: "returns '4 days and 2 hours'",                              start,                         end: "2025-07-11T14:00:00Z",     expected: "4 days and 2 hours" },
      { testTitle: "returns '5 days and 3 hours' (ignoring minutes)",           start,                         end: "2025-07-12T15:12:00Z",     expected: "5 days and 3 hours" },
      { testTitle: "returns '14 days and 3 hours' (ignoring weeks)",            start: "2025-07-27T15:59:00Z", end: "2025-08-10T19:39:00Z",     expected: "14 days and 3 hours" },
      { testTitle: "returns '1 month'",                                         start,                         end: "2025-08-06T12:00:00Z",     expected: "1 month" },
      { testTitle: "returns '2 months'",                                        start,                         end: "2025-09-05T12:00:00Z",     expected: "2 months" },
      { testTitle: "returns '3 months and 1 day'",                              start,                         end: "2025-10-06T12:00:00Z",     expected: "3 months and 1 day" },
      { testTitle: "returns '4 months and 2 days'",                             start,                         end: "2025-11-06T12:00:00Z",     expected: "4 months and 2 days" },
      { testTitle: "returns '5 months and 3 days' (ignoring hours)",            start,                         end: "2025-12-07T23:00:00Z",     expected: "5 months and 3 days" },
      { testTitle: "returns '1 year'",                                          start,                         end: "2026-07-07T12:00:00Z",     expected: "1 year" },
      { testTitle: "returns '2 years'",                                         start,                         end: "2027-07-07T12:00:00Z",     expected: "2 years" },
      { testTitle: "returns '3 years and 1 month'",                             start,                         end: "2028-08-07T12:00:00Z",     expected: "3 years and 1 month" },
      { testTitle: "returns '4 years and 2 months'",                            start,                         end: "2029-09-07T12:00:00Z",     expected: "4 years and 2 months" },
      { testTitle: "returns '5 years and 3 months' (ignoring days)",            start,                         end: "2030-10-08T12:00:00Z",     expected: "5 years and 3 months" },
      { testTitle: "returns '100 years and 1 month' (never goes beyond years)", start,                         end: "2124-03-07T12:00:00Z",     expected: "100 years and 1 month" },
    ])("$testTitle", ({ start, end, expected }) => {
      const result = getHumanReadableShortDuration(
        DateTime.fromISO(start),
        DateTime.fromISO(end)
      );
      expect(result).toBe(expected);
    });
    
  });

});
