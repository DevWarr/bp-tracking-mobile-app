import { BloodPressureRecording } from "../models/BloodPressureRecording";

export enum BloodPressureDispatchActionType {
  INITIALIZE,
  NEW,
  EDITED,
  DELETED
}

export interface IBloodPressureDispatchAction {
  actionType: BloodPressureDispatchActionType
}

export class BloodPressureDispatchAction implements IBloodPressureDispatchAction {

  constructor(
    readonly actionType: BloodPressureDispatchActionType,
    readonly bloodPressureRecording: BloodPressureRecording
  ) { }
}

export class BloodPressureInitialDispatchAction implements IBloodPressureDispatchAction {

  constructor(
    readonly bloodPressureRecordings: BloodPressureRecording[],
    readonly actionType = BloodPressureDispatchActionType.INITIALIZE,
  ) {}
}
