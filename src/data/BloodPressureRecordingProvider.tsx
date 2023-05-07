import { createContext, useEffect, useReducer, ReactNode } from "react";
import { BloodPressureRecording } from "../models/BloodPressureRecording";
import {
  BloodPressureDispatchAction,
  BloodPressureDispatchActionType,
  BloodPressureInitialDispatchAction,
  IBloodPressureDispatchAction
} from "./BloodPressureDispatchAction";
import { loadData, saveData } from "./asyncStorageDatabase";

export const BloodPressureRecordingContext = createContext<BloodPressureRecording[] | null>(null)
export const BloodPressureRecordingDispatchContext = createContext<React.Dispatch<IBloodPressureDispatchAction> | null>(null)

/**
 * Reducer to handle different actions that can change blood pressure recordings
 */
const bloodPressureRecordingReducer = (
  existingBloodPressureRecordings: BloodPressureRecording[],
  action: IBloodPressureDispatchAction
): BloodPressureRecording[] => {
  if (action instanceof BloodPressureInitialDispatchAction) {
    const newData = action.bloodPressureRecordings;
    newData.sort((a, b) => b.dateInfo.localeCompare(a.dateInfo))
    saveData(newData);
    return newData;
  }

  const bloodPressureAction = action as BloodPressureDispatchAction

  switch (bloodPressureAction.actionType) {

    case BloodPressureDispatchActionType.NEW: {
      const newData = [...existingBloodPressureRecordings, bloodPressureAction.bloodPressureRecording];
      newData.sort((a, b) => b.dateInfo.localeCompare(a.dateInfo))
      saveData(newData);
      return newData;
    }

    case BloodPressureDispatchActionType.EDITED: {
      const newData = existingBloodPressureRecordings.map(singleBloodPressureRecording => {
        if (singleBloodPressureRecording.id === bloodPressureAction.bloodPressureRecording.id) {
          return bloodPressureAction.bloodPressureRecording;
        } else {
          return singleBloodPressureRecording;
        }
      })
      newData.sort((a, b) => b.dateInfo.localeCompare(a.dateInfo))
      saveData(newData);
      return newData;
    }

    case BloodPressureDispatchActionType.DELETED: {
      const newData = existingBloodPressureRecordings.filter(singleBloodPressureRecording =>
        singleBloodPressureRecording.id !== bloodPressureAction.bloodPressureRecording.id
      );
      saveData(newData);
      return newData;
    }

    default: {
      throw Error('Unknown action: ' + bloodPressureAction.actionType);
    }
  }
}

/**
 * React Context Provider for managing blood pressure recordings
 */
export const BloodPressureRecordingProvider = ({ children }: {children: ReactNode}) => {
  const [bloodPressureRecordings, dispatch] = useReducer(bloodPressureRecordingReducer, [])

  const initializeData = async () => {
    dispatch(new BloodPressureInitialDispatchAction(await loadData()))
  }

  useEffect(() => {
    initializeData()
  }, [])

  return (
    <BloodPressureRecordingContext.Provider value={bloodPressureRecordings}>
      <BloodPressureRecordingDispatchContext.Provider value={dispatch}>
        {children}
      </BloodPressureRecordingDispatchContext.Provider>
    </BloodPressureRecordingContext.Provider>
  )
}
