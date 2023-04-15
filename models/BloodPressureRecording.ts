// Needed for UUID support
// https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import 'react-native-get-random-values';
import { v4 as generateV4UUID } from 'uuid';

export enum TimeOfDay {
  MORNING = 'AM',
  EVENING = 'PM'
}

/**
 * Audit Fields for a model.
 *
 * Fields in this interface are readonly,
 * so any updates to the audit fields will require you to create a new AuditField.
 */
export class AuditFields {
  constructor(
    /** When the model was created. Should be a valid ISO string in UTC time. */
    public createdDateTime: string = new Date().toISOString(),
    /** When the model was last updated. Should be a valid ISO string in UTC time. */
    public lastUpdatedDateTime: string = new Date().toISOString(),
  ) {}
}


export class BloodPressureRecording {

  /** unique ID */
  readonly id: string;
  /** Date of the recording. This should be in "YYYY-MM-DD" format. */
  date: string;
  /** Whether the recording was taken in the morning or evening */
  timeOfDay: TimeOfDay
  systolic: number;
  diastolic: number;
  heartRate: number;
  notes?: string;
  auditFields: AuditFields;

  constructor(date: string, timeOfDay: TimeOfDay, systolic: number, diastolic: number, heartRate: number, notes?: string, auditFields?: AuditFields) {
    this.id = generateV4UUID()
    this.date = date
    this.timeOfDay = timeOfDay
    this.systolic = systolic
    this.diastolic = diastolic
    this.heartRate = heartRate
    this.notes = notes ? (notes.trim() || undefined) : undefined
    this.auditFields = auditFields ? auditFields : new AuditFields()
  }

  get dateInfo(): string {
    return `${this.date} ${this.timeOfDay}`
  }
}
