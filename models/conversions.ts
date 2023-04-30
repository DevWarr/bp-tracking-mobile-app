export const convertDateToDateStringAndTimeOfDay = (date: Date) => {
    // Make a copy of the date, just in case we make changes to the object for printing
    const dateToPrint = new Date(date.getTime());
    // If we have a time from midnight to 6AM, we'll consider that "PM" of the previous day
    if (date.getHours() < 6) dateToPrint.setDate(date.getDate() - 1)
    const dateString = formatDateAsYYYYMMDD(date)

    // AM recording = between 0600 and 1800
    // PM recording = beteen 1600 and 0600 of the next day
    const timeOfDay = (6 < dateToPrint.getHours() && dateToPrint.getHours() < 18) ? "AM" : "PM"

    return {dateString, timeOfDay}
}

/**
 * Creates a string of the given date with YYYY-MM-DD format.
 *
 * How it works:
 *
 * 1. Converts the date to a UTC date with the same year, month, and day
 * 2. Takes the ISO string,
 * 3. And truncates at the "T" value to only return the year, month, and day
 */
export const formatDateAsYYYYMMDD = (date: Date): string => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
        .toISOString()
        .split("T")[0];
}

/** Creates an "AM" or "PM" string for the given Date object */
export const formatTimeOfDayFromDate = (date: Date) => date.getHours() < 12 ? "AM" : "PM"

/**
 * Creates a string of the time of the given date with HH:mm format
 *
 * Can format time in 24hr time, or 12hr time.
 */
export const formatTimeFromDate = (date: Date, is24hrTime: boolean = true): string => {
    if (is24hrTime) {
        return `${date.getHours()}:${date.getMinutes()}`
    }

    const timeIn12Hours = (date.getHours() === 0) ? 12 : date.getHours() % 12
    const timeOfDay = formatTimeOfDayFromDate(date)

    return `${timeIn12Hours}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} ${timeOfDay}`
}

/**
 * Combines two date objects to return one date object with the date and time from each.
 * 
 * This function:
 * 
 * 1. Gets the date from the `dateObjectForDate`
 * 2. Gets the time form the `dateObjectForTime`
 * 3. Gets the timezone offset from the `dateObjectForDate` (which should be the same as the `dateObjectForTime`)
 * 4. Combines all three items together to make the date string for a new `Date` object
 */
export const buildDateFromDateAndTime = (dateObjectForDate: Date, dateObjectForTime: Date, timezoneOffsetMinutes: number): Date => {
    const dateString = dateObjectForDate.toISOString().split("T")[0];
    const timeString = dateObjectForTime.toISOString().split("T")[1].replace("Z", "");
    const timeZoneOffsetInHours = timezoneOffsetMinutes / 60;
    const formattedTimeZoneOffset = `${timeZoneOffsetInHours > 0 ? '-' : '+'}${Math.abs(timeZoneOffsetInHours)
      .toString()
      .padStart(2, '0')}:00`;
    const dateAndTimeString = `${dateString}T${timeString}${formattedTimeZoneOffset}`;
    console.log({dateString, timeString, timezoneOffsetMinutes, timeZoneOffsetInHours, formattedTimeZoneOffset, dateAndTimeString})
    return new Date(dateAndTimeString);
};
