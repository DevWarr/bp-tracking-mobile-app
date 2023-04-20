import { AuditFields, BloodPressureRecording } from "./BloodPressureRecording";
import BloodPressureRecordingJsonValidator from "./BloodPressureRecordingJsonValidator";


interface IAuditFieldsJsonObject {
  /** When the model was created. ISO date string, UTC timezone. */
  createdDateTime: string;
  /** When the model was last updated. ISO date string, UTC timezone. */
  lastUpdatedDateTime: string;
}

export interface IBloodPressureJsonObject {
  /** Date of the Blood Pressure recording. ISO date string, UTC timezone. */
  date: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  notes?: string;
  auditFields?: IAuditFieldsJsonObject;
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
  if (!jsonObject.date && jsonObject.dateTimeNumber) {
    return {
      ...jsonObject,
      date: new Date(jsonObject.dateTimeNumber).toISOString(),
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
    // If audit fields already exist, use them. Otherwise, make new ones '' '
    const auditFields = jsonObject.auditFields ?
      new AuditFields(new Date(jsonObject.auditFields.createdDateTime), new Date(jsonObject.auditFields.lastUpdatedDateTime))
      : new AuditFields()

    return new BloodPressureRecording(
      new Date(jsonObject.date),
      jsonObject.systolic,
      jsonObject.diastolic,
      jsonObject.heartRate,
      jsonObject.notes,
      auditFields
    )
  })
}

/**
 * Builds a JSON string from a list of blood pressure recordings.
 *
 * @returns JSON string of all blood pressure recordings
 */
const buildJsonStringFromBloodPressureRecordingList = (bloodPressureRecordingList: BloodPressureRecording[]): string => {
  const jsonObjectList: IBloodPressureJsonObject[] = bloodPressureRecordingList.map(bloodPressureRecording => ({
    date: bloodPressureRecording.date.toISOString(),
    systolic: bloodPressureRecording.systolic,
    diastolic: bloodPressureRecording.diastolic,
    heartRate: bloodPressureRecording.heartRate,
    notes: bloodPressureRecording.notes,
    auditFields: {
      createdDateTime: bloodPressureRecording.auditFields.createdDateTime.toISOString(),
      lastUpdatedDateTime: bloodPressureRecording.auditFields.lastUpdatedDateTime.toISOString()
    }
  }))
  return JSON.stringify(jsonObjectList)
}

export default {
  buildBloodPressureRecordingListFromJsonString,
  buildJsonStringFromBloodPressureRecordingList
}
