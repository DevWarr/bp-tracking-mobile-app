import { AuditFields, BloodPressureRecording, TimeOfDay } from "./BloodPressureRecording";
import { convertDateToDateStringAndTimeOfDay } from "./conversions";
import BloodPressureRecordingJsonValidator from "./BloodPressureRecordingJsonValidator";


export interface IBloodPressureJsonObject {
  date: string;
  timeOfDay: TimeOfDay;
  systolic: number;
  diastolic: number;
  heartRate: number;
  notes?: string;
  auditFields?: AuditFields;
}

/**
 * Transforms a JSON Object from old schema to new schema.
 * 
 * Old Schema: dateTimeNumber field had a date that was used to calculate the datetime of the BP recording.
 * 
 * New Schema: there's a dateString and timeOfDay field that show the datetime of the BP Recording.
 * 
 * @param jsonObject JSON Object to modify
 * @returns JSON Object with new format, if transformation was successful
 */
const transformOldFormatToNewFormat = (jsonObject: any): any => {
  if ((!jsonObject.date || !jsonObject.timeOfDay) && jsonObject.dateTimeNumber) {
    const {dateString, timeOfDay} = convertDateToDateStringAndTimeOfDay(new Date(jsonObject.dateTimeNumber))
    return {
      ...jsonObject,
      date: dateString,
      timeOfDay
    }
  } else {
    return jsonObject
  }
}

/**
 * Builds a list of BloodPressureRecordings from an input JSON string.
 * 
 * Throws an error if there are issues parsing the JSON,
 * or if any of the objects within the JSON are not valid BloodPressureRecording objects.
 * 
 * @param jsonString 
 * @returns List of imported Blood Pressure recordings, all with new audit fields
 */
const buildBloodPressureRecordingListFromJsonString = (jsonString: string): BloodPressureRecording[] => {
  const jsonObjectList = JSON.parse(jsonString)
  const transformedJsonObjectList = jsonObjectList.map(transformOldFormatToNewFormat)

  const jsonValidationErrors = BloodPressureRecordingJsonValidator.validateJsonObjects(transformedJsonObjectList)

  if (jsonValidationErrors.length) throw jsonValidationErrors

  return transformedJsonObjectList.map((jsonObject: IBloodPressureJsonObject) => {
    return new BloodPressureRecording(
      jsonObject.date,
      jsonObject.timeOfDay,
      jsonObject.systolic,
      jsonObject.diastolic,
      jsonObject.heartRate,
      jsonObject.notes,
      jsonObject.auditFields
    )
  })
}

const buildJsonStringFromBloodPressureRecordingList = (bloodPressureRecordingList: BloodPressureRecording[]): string => {
  const jsonObjectList: IBloodPressureJsonObject[] = bloodPressureRecordingList.map(bloodPressureRecording => ({
    date: bloodPressureRecording.date,
    timeOfDay: bloodPressureRecording.timeOfDay,
    systolic: bloodPressureRecording.systolic,
    diastolic: bloodPressureRecording.diastolic,
    heartRate: bloodPressureRecording.heartRate,
    notes: bloodPressureRecording.notes,
    auditFields: bloodPressureRecording.auditFields
  }))
  return JSON.stringify(jsonObjectList)
}

export default {
  buildBloodPressureRecordingListFromJsonString,
  buildJsonStringFromBloodPressureRecordingList
}