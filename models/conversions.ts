import { TimeOfDay } from "./BloodPressureRecording";

export const convertDateToDateStringAndTimeOfDay = (date: Date) => {
    // Make a copy of the date, just in case we make changes to the object for printing
    const dateToPrint = new Date(date.getTime());
    // If we have a time from midnight to 6AM, we'll consider that "PM" of the previous day
    if (date.getHours() < 6) dateToPrint.setDate(date.getDate() - 1)
    const dateString = formatDateAsYYYYMMDD(date)

    // AM recording = between 0600 and 1800
    // PM recording = beteen 1600 and 0600 of the next day
    const timeOfDay = (6 < dateToPrint.getHours() && dateToPrint.getHours() < 18) ? TimeOfDay.MORNING : TimeOfDay.EVENING

    return {dateString, timeOfDay}
}

/** 
 * Formats a Date object with a YYYY-MM-DD format.
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

export const getTimeOfDayFromDate = (date: Date) => date.getHours() < 12 ? TimeOfDay.MORNING : TimeOfDay.EVENING
