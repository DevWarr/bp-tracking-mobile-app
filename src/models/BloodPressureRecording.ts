// Needed for UUID support
// https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import 'react-native-get-random-values';
import { v4 as generateV4UUID } from 'uuid';

/**
 * Audit Fields for a model.
 *
 * Fields in this interface are readonly,
 * so any updates to the audit fields will require you to create a new AuditField.
 */
export class AuditFields {
  constructor(
    /** When the model was created. */
    public createdDateTime: Date = new Date(),
    /** When the model was last updated. */
    public lastUpdatedDateTime: Date = new Date(),
  ) {}
}

const TIME_FORMATTING_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit"
}

export class BloodPressureRecording {

  /** unique ID */
  readonly id: string;
  /** Date of the recording. JS Date format */
  date: Date;
  systolic: number;
  diastolic: number;
  heartRate: number;
  notes?: string;
  auditFields: AuditFields;

  constructor(date: Date, systolic: number, diastolic: number, heartRate: number, notes?: string, auditFields?: AuditFields) {
    this.id = generateV4UUID()
    this.date = date
    this.systolic = systolic
    this.diastolic = diastolic
    this.heartRate = heartRate
    this.notes = notes ? (notes.trim() || undefined) : undefined
    this.auditFields = auditFields ? auditFields : new AuditFields()
  }

  get dateFormatted(): string {
    return this.date.toLocaleDateString()
  }

  get timeFormatted(): string {
    return this.date.toLocaleTimeString(undefined, TIME_FORMATTING_OPTIONS)
  }
}
