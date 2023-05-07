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


/*
The goal of this buildDateFromDateAndTime function is to make a UTC string from the two input date objects,
and use that UTC string to create a new Date object with the correct date and time.
This is tricky, though, because timezones can change depending on both location and date.

The solution?

1. Convert the date object so its UTC time 'looks like' the local date time
2. Check the time object to see if the local time, once converted to UTC time, would change the day
3. If the day should change, update the date object by adding or removing a day

Example:

The Date object is 2023-02-28 00:00:00 in central daylight time (UTC-5)
    The date we want is 2023-02-28 in CDT (which is still 2023-02-28 in UTC time after converting)
The Time object is 1970-01-01 23:00:00 in central daylight time (UTC-5)
    The time we want is 23:00:00 in CDT (which is 04:00:00 in UTC time after converting)
The timezone is central daylight time (UTC-5), so the timezone offset is 300 minutes

Step 1: Ensure the date object, when displayed as UTC, has the same date as the local time we typed.
        2023-02-28 05:00:00 is UTC time - shifting the timezone 5 hours gives us a "UTC" time of 2023-02-28 00:00:00.
        In this case, our date doesn't change after converting, so we still have 2023-02-28  \o/
        (note: in other cases, the date might change, so this conversion step is important)

Step 2: Check the time object to see if the local time, once converted to UTC time, would change the day.
        The time is 1970-01-01 23:00:00 CDT, and the UTC time is 1970-01-02 04:00:00.
        The UTC time is one day in the future,
        so we now know the date object from step 1 also needs to move forward one day to have the correct date.

Step 3: Update the date object from 2023-02-28 to 2023-03-01 so the date will have the correct UTC time when creating the new date.
        Add one day to our date object so it shifts from 2023-02-28 → 2023-03-01.

Step 4: Take the UTC date from our new date object and the UTC time from our time object, and build a new date.
        UTC Date from our object is 2023-03-01
        UTC Time from our object is 04:00:00
        UTC string becomes "2023-03-01T04:00:00" → creating the end date we want \o/

Questions:

Why not just use the UTC date from the original date?
        As we saw in this example, the UTC date should be one day in the future.
        However, since the date object we have doesn't have the correct time,
        the UTC date from our original date object wouldn't be correct  :c

Why not use the getFullYear, getMonth, getHours, getMinutes, etc methods?
        Building a new Date from these values wasn't creating the correct date.
        I forget exactly why this was, but I think this was also related to timezones.
        In addition, since these methods use the system's timezones, unit tests with different timezones weren't working properly.
        Maybe this solution could work and I was missing something.
*/
/**
 * Returns whether the given datetime object, after being converted to UTC,
 * shifts the day into the future or past (or neither)
 *
 * @returns A day offset of either 1, 0, or -1
 */
const getDayOffsetFromTimeAndTimezoneOffset = (dateObjectForTime: Date, timezoneOffsetMinutes: number) => {

    const newDateObjectForTime = new Date(dateObjectForTime.getTime() - timezoneOffsetMinutes * 60 * 1000)
    const dayDifference = newDateObjectForTime.getUTCDate() - dateObjectForTime.getUTCDate()

    // If we need to shift one day into the past
    if ([1, -31, -30, -27].includes(dayDifference)) return -1

    // If we need to shift one day into the future
    if ([-1, 30, 31, 27].includes(dayDifference)) return 1

    // If we don't need to shift at all
    return 0
}
/**
 * Combines two date objects to return one date object with the date and time from each.
 *
 * @param {Date} dateObjectForDate the JS date object with the correct date information
 * @param {Date} dateObjectForTime the JS date object with the correct time information
 * @param {number} timezoneOffsetMinutes The number of minutes the given dates are from UTC time
 */
export const buildDateFromDateAndTime = (
    dateObjectForDate: Date,
    dateObjectForTime: Date,
    timezoneOffsetMinutes: number
): Date => {

    // Convert the date into a new Date object where the UTC date matches the local date that was input by the user
    // So, if the user put in 2023-02-28, and the UTC date says 2023-03-01,
    // This conversion would bring the UTC date back to 2023-02-28.
    const newDateObjectForDate = new Date(dateObjectForDate.getTime() - timezoneOffsetMinutes * 60 * 1000)

    // Get the dayOffset and modify the date to adjust to the offset
    const dayOffset = getDayOffsetFromTimeAndTimezoneOffset(dateObjectForTime, timezoneOffsetMinutes)
    newDateObjectForDate.setUTCDate(newDateObjectForDate.getUTCDate() + dayOffset)

    // Get the date string, the time string, and build a new Date with that information
    const dateString = newDateObjectForDate.toISOString().split("T")[0]
    const timeString = dateObjectForTime.toISOString().split("T")[1]
    return new Date(`${dateString}T${timeString}`)
}
