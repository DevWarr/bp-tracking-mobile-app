import { buildDateFromDateAndTime } from "../../src/conversions/dateTimeConversions";

describe('buildDateFromDateAndTime', () => {
  const testCases: ([string, Date, string, string, number])[] = [
    [
      'UTC',
      new Date("2022-05-01T12:00:00Z"), // expected result
      "2022-05-01T00:00:00Z", // dateObjectForDate string in UTC
      "1970-01-01T12:00:00Z", // dateObjectForTime string in UTC
      0,                      // timeTimezoneOffset for UTC
    ],
    [
      'New York', // Eastern Daylight Time (UTC-4)
      new Date("2022-05-01T22:00:00-04:00"), // expected result
      '2022-05-01T00:00:00-04:00', // dateObjectForDate string in New York
      '1970-01-01T22:00:00-04:00', // dateObjectForTime string in New York
      240,                         // timeTimezoneOffset for New York
    ],
    [
      'New York', // Eastern Daylight Time (UTC-4)
      new Date("2022-05-01T22:00:00-04:00"), // expected result
      '2022-05-01T21:00:00-04:00', // dateObjectForDate string in New York
      '1970-02-28T22:00:00-04:00', // dateObjectForTime string in New York (date is Feb 28th, so a day in the future would be March 1st)
      240,                         // timeTimezoneOffset for New York
    ],
    [
      'Los Angeles', // Pacific Daylight Time (UTC-7)
      new Date("2022-05-01T08:00:00-07:00"), // expected result
      '2022-05-01T00:00:00-07:00', // dateObjectForDate string in Los Angeles
      '1970-01-01T08:00:00-07:00', // dateObjectForTime string in Los Angeles
      420,                         // timeTimezoneOffset for Los Angeles
    ],
    [
      'Tokyo', // Japan Standard Time (UTC+9)
      new Date("2022-05-01T08:00:00+09:00"), // expected result
      '2022-05-01T00:00:00+09:00', // dateObjectForDate string in Tokyo
      '1970-01-01T08:00:00+09:00', // dateObjectForTime string in Tokyo
      -540,                        // timeTimezoneOffset for Tokyo
    ],
    [
      'Tokyo', // Japan Standard Time (UTC+9)
      new Date("2022-05-01T08:00:00+09:00"), // expected result
      '2022-05-01T00:00:00+09:00', // dateObjectForDate string in Tokyo
      '1970-03-01T08:00:00+09:00', // dateObjectForTime string in Tokyo (date is Mar 1st, so a day in the past would be february 28th)
      -540,                        // timeTimezoneOffset for Tokyo
    ],
  ];

  testCases.forEach(([
    timezone,
    expected,
    dateObjectForDateString,
    dateObjectForTimeString,
    timeTimezoneOffset,
  ]) => {
    it(`should return correct date and time in ${timezone} (${dateObjectForDateString} and ${dateObjectForTimeString})`, () => {
      const actual = buildDateFromDateAndTime(
        new Date(dateObjectForDateString),
        new Date(dateObjectForTimeString),
        timeTimezoneOffset
      );
      expect(actual).toEqual(expected);
    });
  });
});
