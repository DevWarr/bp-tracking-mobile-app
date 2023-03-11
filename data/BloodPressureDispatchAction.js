export class BloodPressureDispatchActionType {
    static NEW = new BloodPressureDispatchActionType("NEW");
    static EDITED = new BloodPressureDispatchActionType("EDITED");
    static DELETED = new BloodPressureDispatchActionType("DELETED");
  
    constructor(name) { this.name = name }
  
    toString = () => `BloodPressureDispatchActionType.${this.name}`
  }
  
export class BloodPressureDispatchAction {
  /**
   * 
   * @param {BloodPressureDispatchActionType} actionType - The type of action being performed
   * @param {BloodPressureRecording} bloodPressureRecording 
   */
  constructor(actionType, bloodPressureRecording) {
    this.actionType = actionType;
    this.bloodPressureRecording = bloodPressureRecording;
  }
}

export class BloodPressureInitialDispatchAction {
  /**
   * 
   * @param {BloodPressureRecording[]} bloodPressureRecordings
   */
  constructor(bloodPressureRecordings) {
    this.bloodPressureRecordings = bloodPressureRecordings;
  }
}