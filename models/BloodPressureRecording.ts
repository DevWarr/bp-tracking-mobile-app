// Needed for UUID support
// https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import 'react-native-get-random-values';
import { v4 as generateV4UUID } from 'uuid';

export interface IBloodPressureJsonObject {
  dateTimeNumber: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
  notes?: string;
}

export class BloodPressureRecording {

  readonly id: string;
  readonly datetime: Date;
  readonly systolic: number;
  readonly diastolic: number;
  readonly heartRate: number;
  readonly notes?: string;

  constructor(systolic: number, diastolic: number, heartRate: number, notes?: string, dateTimeNumber?: number) {
    this.id = generateV4UUID();
    this.datetime = dateTimeNumber ? new Date(dateTimeNumber) : new Date()
    this.systolic = systolic
    this.diastolic = diastolic
    this.heartRate = heartRate
    this.notes = notes ? (notes.trim() || undefined) : undefined
  }

  static buildFromJsonObject = (jsonObject: IBloodPressureJsonObject) => {
    return new BloodPressureRecording(
      jsonObject.systolic,
      jsonObject.diastolic,
      jsonObject.heartRate,
      jsonObject.notes,
      jsonObject.dateTimeNumber,
    )
  }

  buildJsonObject = (): IBloodPressureJsonObject => {
    return {
      dateTimeNumber: this.datetime.getTime(),
      systolic: this.systolic,
      diastolic: this.diastolic,
      heartRate: this.heartRate,
      notes: this.notes,
    }
  }

  getDateInfo = (): string => {
    // Make a copy of the date, just in case we make changes to the object for printing
    const dateToPrint = new Date(this.datetime.getTime());
    // If we have a time from midnight to 6AM, that's technically "PM" of the previous day
    if (this.datetime.getHours() < 6) dateToPrint.setDate(this.datetime.getDate() - 1)

    // AM recording = between 0600 and 1800
    // PM recording = beteen 1600 and 0600 of the next day
    const isAM = (6 < dateToPrint.getHours() && dateToPrint.getHours() < 18)

    const dateString = dateToPrint.toISOString().substring(0, 10)
    const AmOrPmString = isAM ? "AM" : "PM"

    return `${dateString} ${AmOrPmString}`
  }
}