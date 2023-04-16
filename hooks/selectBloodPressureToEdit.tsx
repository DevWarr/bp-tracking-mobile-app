import { useContext } from "react";
import { BloodPressureRecording } from "../models/BloodPressureRecording"
import { BloodPressureRecordingContext } from "../data/BloodPressureRecordingProvider";

interface ISelectBloodPressureToEdit {
  isEditing: boolean;
  bloodPressureRecordingToEdit: BloodPressureRecording | null;
}

/**
 * Returns blood pressure recording for the edit form, if one is requested.
 *
 * REQUIRED: This hook uses the BloodPressureRecordingContext,
 * so it must be used within a <BloodPressureRecordingProvider>
 *
 * @param bloodPressureRecordingId
 * @returns Whether we're editing the form, and if we are - which BP recording we're editing
 */
export const selectBloodPressureToEdit = (bloodPressureRecordingId: string): ISelectBloodPressureToEdit => {
  if (!bloodPressureRecordingId) {
    return {isEditing: false, bloodPressureRecordingToEdit: null}
  }

  const bloodPressureRecordings = useContext(BloodPressureRecordingContext)
  const bloodPressureRecordingToEdit = bloodPressureRecordings.find(bloodPressureRecording => bloodPressureRecording.id === bloodPressureRecordingId)

  return {
    isEditing: !!bloodPressureRecordingToEdit,
    bloodPressureRecordingToEdit
  }

}