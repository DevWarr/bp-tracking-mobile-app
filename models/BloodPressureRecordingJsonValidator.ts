const FIELD_MISSING_MESSAGE = "Field is missing"
const buildInvalidTypeMessage = (expectedType: string, actualType: string) => `Invalid type: expected \`${expectedType}\`, got \`${actualType}\``

enum JSTypes {
  STRING = "string",
  OBJECT = "object",
  NUMBER = "number",
  DATE   = "Date"
}

enum BloodPressureRecordingJsonValidationErrorReason {
  FIELD_MISSING = "FIELD_MISSING",
  INVALID_TYPE = "INVALID_TYPE",
  INVALID_VALUE = "INVALID_VALUE"
}

class BloodPressureRecordingJsonFieldValidationError {
  constructor(
    readonly fieldName: string,
    readonly validationErrorReason: BloodPressureRecordingJsonValidationErrorReason,
    readonly validationErrorMessage: string
  ) {}
}

export class BloodPressureRecordingJsonValidationError {
  constructor(
    readonly inputJson: any,
    readonly fieldErrors: BloodPressureRecordingJsonFieldValidationError[]
  ) {}
}

/**
 * Validates whether a list of JSON objects are a valid BloodPressureRecording object.
 *
 * @param jsonObjectList List of potential JSON Objects
 * @returns List of validation errors. If the list is empty, no validation errors were found '' '
 */
const validateJsonObjects = (jsonObjectList: any[]): BloodPressureRecordingJsonValidationError[] => {
  const validationErrors: BloodPressureRecordingJsonValidationError[] = jsonObjectList
    .map(jsonObject => validateSingleJsonObject(jsonObject))
    .filter(validationErrorsMaybe => !!validationErrorsMaybe && !!validationErrorsMaybe.fieldErrors)

  return validationErrors
}

const isValidDateString = (dateString: string): boolean => !isNaN(new Date(dateString).getTime())

/**
 * Validates whether a single JSON Object is a valid BloodPressureRecording object.
 *
 * @param jsonObject object to validate
 * @returns validation error. If `null` is returned, there are no validation errors
 */
const validateSingleJsonObject = (jsonObject: any): BloodPressureRecordingJsonValidationError | null => {

  const validationFieldErrors: BloodPressureRecordingJsonFieldValidationError[] = []

  if (typeof jsonObject !== JSTypes.OBJECT) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "jsonObject",
        BloodPressureRecordingJsonValidationErrorReason.INVALID_TYPE,
        buildInvalidTypeMessage(JSTypes.OBJECT, typeof jsonObject)
      )
    )
  }

  if (!jsonObject.date) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "date",
        BloodPressureRecordingJsonValidationErrorReason.FIELD_MISSING,
        FIELD_MISSING_MESSAGE
      )
    )
  }
  if (jsonObject.date && !isValidDateString(jsonObject.date)) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "date",
        BloodPressureRecordingJsonValidationErrorReason.INVALID_TYPE,
        buildInvalidTypeMessage(JSTypes.DATE, "invalid date")
      )
    )
  }

  if (!jsonObject.systolic) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "systolic",
        BloodPressureRecordingJsonValidationErrorReason.FIELD_MISSING,
        FIELD_MISSING_MESSAGE
      )
    )
  }
  if (jsonObject.systolic && typeof jsonObject.systolic !== JSTypes.NUMBER) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "systolic",
        BloodPressureRecordingJsonValidationErrorReason.INVALID_TYPE,
        buildInvalidTypeMessage(JSTypes.NUMBER, typeof jsonObject.systolic)
      )
    )
  }

  if (!jsonObject.diastolic) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "diastolic",
        BloodPressureRecordingJsonValidationErrorReason.FIELD_MISSING,
        FIELD_MISSING_MESSAGE
      )
    )
  }
  if (jsonObject.diastolic && typeof jsonObject.diastolic !== JSTypes.NUMBER) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "diastolic",
        BloodPressureRecordingJsonValidationErrorReason.INVALID_TYPE,
        buildInvalidTypeMessage(JSTypes.NUMBER, typeof jsonObject.diastolic)
      )
    )
  }

  if (!jsonObject.heartRate) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "heartRate",
        BloodPressureRecordingJsonValidationErrorReason.FIELD_MISSING,
        FIELD_MISSING_MESSAGE
      )
    )
  }
  if (jsonObject.heartRate && typeof jsonObject.heartRate !== JSTypes.NUMBER) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "heartRate",
        BloodPressureRecordingJsonValidationErrorReason.INVALID_TYPE,
        buildInvalidTypeMessage(JSTypes.NUMBER, typeof jsonObject.heartRate)
      )
    )
  }

  if (jsonObject.notes && typeof jsonObject.notes !== JSTypes.STRING) {
    validationFieldErrors.push(
      new BloodPressureRecordingJsonFieldValidationError(
        "notes",
        BloodPressureRecordingJsonValidationErrorReason.INVALID_TYPE,
        buildInvalidTypeMessage(JSTypes.STRING, typeof jsonObject.notes)
      )
    )
  }

  if (validationFieldErrors.length) {
    return new BloodPressureRecordingJsonValidationError(jsonObject, validationFieldErrors)
  }
  else {
    return null
  }
}

export default {
  validateJsonObjects
}
