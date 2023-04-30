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
export const buildDateFromDateAndTime = (
    dateObjectForDate: Date,
    dateObjectForTime: Date,
    timezoneOffset: number
): Date => {
    
    const newDateObjectForTime = new Date(dateObjectForTime.getTime() - timezoneOffset * 60 * 1000)
    const newDateObjectForDate = new Date(dateObjectForDate.getTime() - timezoneOffset * 60 * 1000)

    const dayDifference = newDateObjectForTime.getUTCDate() - dateObjectForTime.getUTCDate()
    if ([1, -31, -30, -27].includes(dayDifference)) {
        newDateObjectForDate.setUTCDate(newDateObjectForDate.getUTCDate() - 1)
    } else if ([-1, 30, 31, 27].includes(dayDifference)) {
        newDateObjectForDate.setUTCDate(newDateObjectForDate.getUTCDate() + 1)
    }

    const dateString = newDateObjectForDate.toISOString().split("T")[0]
    const timeString = dateObjectForTime.toISOString().split("T")[1]
    console.log({dateObjectForTime, newDateObjectForTime, dayDifference})
    return new Date(`${dateString}T${timeString}`)
}
