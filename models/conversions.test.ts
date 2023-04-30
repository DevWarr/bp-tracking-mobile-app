import { buildDateFromDateAndTime } from "./conversions";

describe('buildDateFromDateAndTime', () => {
  const testCases: Array<[string, Date, string, string, number]> = [
    [
      'UTC',
      new Date(Date.UTC(2022, 4, 1, 12, 0, 0)), // expected result
      "2022-03-01T00:00:00Z", // dateObjectForDate string in UTC
      "1970-03-01T12:00:00Z", // dateObjectForTime string in UTC
      0,
    ],
    [
      'New York', // Eastern Daylight Time (UTC-4)
      new Date(Date.UTC(2022, 4, 1, 16, 0, 0)), // expected result
      '2022-05-01T00:00:00-04:00', // dateObjectForDate string in New York
      '1970-01-01T08:00:00-04:00', // dateObjectForTime string in New York
      240,
    ],
    [
      'Los Angeles', // Pacific Daylight Time (UTC-7)
      new Date(Date.UTC(2022, 4, 1, 19, 0, 0)), // expected result
      '2022-05-01T00:00:00-07:00', // dateObjectForDate string in Los Angeles
      '1970-01-01T08:00:00-07:00', // dateObjectForTime string in Los Angeles
      420,
    ],
    [
      'Tokyo', // Japan Standard Time (UTC+9)
      new Date(Date.UTC(2022, 3, 30, 15, 0, 0)), // expected result
      '2022-05-01T00:00:00+09:00', // dateObjectForDate string in Tokyo
      '1970-01-01T08:00:00+09:00', // dateObjectForTime string in Tokyo
      -540,
    ],
  ];

  testCases.forEach(([timezone, expected, dateObjectForDateString, dateObjectForTimeString, timezoneOffsetMinutes]) => {
    it(`should return correct date and time in ${timezone} (${dateObjectForDateString} and ${dateObjectForTimeString})`, () => {
      const actual = buildDateFromDateAndTime(
        new Date(dateObjectForDateString),
        new Date(dateObjectForTimeString),
        timezoneOffsetMinutes
      );
      expect(actual).toEqual(expected);
    });
  });
});
  