// Convert CSV BP Data to Json
/* tslint:disable:no-console */

const inputString = `2022-12-07 evening ,150,94,58,
2022-12-08 morning,124,88,85,
2022-12-08 evening ,159,94,97,Had two drinks: martini and cider. Last drink was 2.5 hours before this reading
2022-12-09 morning,139,93,72,
2022-12-09 evening,146,104,75,Divya's birthday
2022-12-10 morning ,148,98,76,
2022-12-10 evening,148,93,57,
2022-12-11 morning,143,97,69,3:30pm (oops)
2022-12-11 evening,--,--,--,
2022-12-12 morning,140,94,61,
2022-12-12 evening,--,--,--,
2022-12-13 morning,--,--,--,
2022-12-13 evening,138,78,,
2022-12-14 morning ,--,--,--,
2022-12-14 evening,--,--,--,
2022-12-15 morning ,--,--,--,
2022-12-15 evening,143,86,86,
2022-12-16 morning,143,93,60,
2022-12-16 evening ,133,89,74,Asian friends of DFW Winter party (BP taken before leaving)
2022-12-17 morning,--,--,--,
2022-12-17 evening,147,94,66,
2022-12-18 morning,158,101,63,
2022-12-18 evening,147,92,65,
2022-12-19 morning,130,78,60,I'm sick?
2022-12-19 evening ,142,89,80,
2022-12-20 morning,--,--,--,
2022-12-20 evening,137,90,71,
2022-12-21 morning,151,101,,
2022-12-21 evening ,143,86,56,
2022-12-22 morning,145,90,62,
2022-12-22 evening ,148,89,96,
2022-12-23 morning,151,85,67,
2022-12-23 evening ,--,--,--,
2022-12-24 morning,154,96,73,
2022-12-24 evening ,,,,
2022-12-25 morning,155,103,73,
2022-12-25 evening ,--,--,--,
2022-12-26 morning,149,102,64,
2022-12-26 evening ,147,92,78,
2022-12-27 morning,141,101,73,
2022-12-27 evening ,137,96,72,
2022-12-28 morning,--,--,--,
2022-12-28 evening ,162,91,69,First night taking BP medication
2022-12-29 morning,151,98,55,
2022-12-29 evening ,154,78,62,
2022-12-30 morning,136,83,61,
2022-12-30 evening ,129,84,64,Occasional dizziness/lightheadedness
2022-12-31 morning,142,84,62,
2022-12-31 evening ,106,71,91,
2023-01-01 morning,132,78,55,
2023-01-01 evening ,106,73,67,
2023-01-02 morning,111,80,82,
2023-01-02 evening ,113,72,77,
2023-01-03 morning,137,82,67,
2023-01-03 evening ,145,64,77,
2023-01-04 morning,124,78,73,Took blood pressue medication late
2023-01-04 evening ,140,89,65,
2023-01-05 morning,--,--,--,
2023-01-05 evening ,136,80,77,
2023-01-06 morning,149,,69,Took BP medication late
2023-01-06 evening,116,78,86,
2023-01-07 morning,122,73,59,
2023-01-07 evening ,131,72,62,
2023-01-08 morning ,146,89,63,
2023-01-08 evening,124,66,64,
2023-01-09 morning ,148,81,81,
2023-01-09 evening,124,80,69,
2023-01-10 morning ,149,86,68,Occasional muscle cramps since this day
2023-01-10 evening,--,--,--,
2023-01-11 morning ,111,71,79,
2023-01-11 evening,127,74,58,
2023-01-12 morning ,118,67,57,"1 run immediately before this, it was 132/94, 83bpm. 16:45 felt very light headed and had to take a break from work"
2023-01-12 evening,119,76,68,Diarrhea
2023-01-13 morning ,,,,
2023-01-13 evening,119,66,71,
2023-01-14 morning,130,75,55,
2023-01-14 evening,125,70,62,
2023-01-15 morning,125,81,71,
2023-01-15 evening,,,,Forgot to take BP medication
2023-01-16 morning,132,74,55,Took BP medication this morning
2023-01-16 evening,122,75,73,
2023-01-17 morning,,,,
2023-01-17 evening,126,71,64,
2023-01-18 morning,,,,
2023-01-18 evening,107,72,85,
2023-01-19 morning,,,,
2023-01-19 evening,125,77,65,
2023-01-20 morning,129,77,66,
2023-01-20 evening,--,--,--,
2023-01-21 morning,121,69,58,
2023-01-21 evening,112,63,95,
2023-01-22 morning,129,78,71,
2023-01-22 evening,136,73,64,
2023-01-23 morning,--,--,--,
2023-01-23 evening,122,70,58,
2023-01-24 morning,125,72,61,
2023-01-24 evening,130,73,68,
2023-01-25 morning,--,--,--,
2023-01-25 evening,128,73,65,
2023-01-26 morning,133,65,60,
2023-01-26 evening,148,68,58,
2023-01-27 morning,130,76,61,
2023-01-27 evening,--,--,--,
2023-01-28 morning,--,--,--,
2023-01-28 evening,128,80,63,
2023-01-29 morning,119,77,66,
2023-01-29 evening,,,,
2023-01-30 morning,116,68,60,
2023-01-30 evening,125,74,58,
2023-02-01 morning,,,,
2023-02-01 evening ,132,65,60,
2023-02-02 morning,--,--,--,Florida trip - didn't take BP reader
2023-02-02 evening ,--,--,--,
2023-02-03 morning,--,--,--,
2023-02-03 evening ,--,--,--,
2023-02-04 morning,--,--,--,
2023-02-04 evening ,--,--,--,
2023-02-05 morning,--,--,--,
2023-02-05 evening ,--,--,--,
2023-02-06 morning,--,--,--,
2023-02-06 evening ,--,--,--,
2023-02-07 morning,--,--,--,
2023-02-07 evening,114,72,68,
2023-02-08 morning,--,--,--,
2023-02-08 evening,123,75,62,
2023-02-09 morning,139,87,63,
2023-02-09 evening,121,75,68,
2023-02-10 morning,--,--,--,
2023-02-10 evening,121,76,75,
2023-02-11 morning,--,--,--,
2023-02-11 evening,--,--,--,
2023-02-12 morning,--,--,--,
2023-02-12 evening,--,--,--,
2023-02-13 morning,133,83,55,"Didn't take BP medication last night, oops"
2023-02-13 evening,,,,
2023-02-14 morning,,,,
2023-02-14 evening,126,78,57,
2023-02-15 morning,,,,
2023-02-15 evening,,,,
2023-02-16 morning,,,,
2023-02-16 evening,,,,
2023-02-17 morning,,,,
2023-02-17 evening,,,,
2023-02-18 morning,,,,
2023-02-18 evening,,,,
2023-02-19 morning,,,,
2023-02-19 evening,,,,
2023-02-20 morning,,,,
2023-02-20 evening,,,,`

interface IBloodPressureJsonObject {
    dateTimeNumber: number;
    systolic: number;
    diastolic: number;
    heartRate: number;
    notes?: string;
  }

const datetimeMapping = (inputDateString: string): number => {
    const [dateString, timeOfDayString] = inputDateString.split(" ")
    const date = new Date(dateString)
    // If it's in the morning, set time of day to 0700 ( 7AM)
    // If it's in the evening, set time of day to 2300 (11PM)
    date.setHours(timeOfDayString === "morning" ? 7 : 23)
    return date.getTime()
}


/**
 * Assumes input data has NO headers
 */
const convertCsvToJson = (inputCsv: string) => {
    const allRows = inputCsv.split("\n")
    const bloodPressureJsonObjects: IBloodPressureJsonObject[] = allRows.map((singleRow) => {
        const itemsFromRow = singleRow.split(",").map(it => it.replace(/-{2,}/g, "").trim())
        const [datetimeString, systolicString, diastolicString, heartRateString, notes] = itemsFromRow

        if (!datetimeString || !systolicString || !diastolicString || !heartRateString) {
            console.log({singleRow, error: "Missing fields"})
            return null
        }

        try {
            return {
                dateTimeNumber: datetimeMapping(datetimeString),
                systolic: Number(systolicString),
                diastolic: Number(diastolicString),
                heartRate: Number(heartRateString),
                notes: notes || null,
            }
        } catch (error) {
            console.error({singleRow, error})
            return null
        }
    })
    .filter(it => it !== null)
    return JSON.stringify(bloodPressureJsonObjects)
}

console.log(convertCsvToJson(inputString));
