import React, { Context, createContext, ReactNode, useEffect, useReducer } from "react";
import { BloodPressureRecording } from "../models/BloodPressureRecording";
import { loadData, saveData } from "./asyncStorageDatabase";
import { 
  BloodPressureDispatchAction,
  BloodPressureDispatchActionType,
  BloodPressureInitialDispatchAction,
  IBloodPressureDispatchAction
} from "./BloodPressureDispatchAction";

export const BloodPressureRecordingContext = createContext<BloodPressureRecording[] | null>(null)
export const BloodPressureRecordingDispatchContext = createContext<React.Dispatch<IBloodPressureDispatchAction> | null>(null)

/**
 * Reducer to handle different actions that can change blood pressure recordings
 */
const bloodPressureRecordingReducer = (
  existingBloodPressureRecordings: BloodPressureRecording[],
  action: IBloodPressureDispatchAction
): BloodPressureRecording[] => {
  console.log(action)
  if (action instanceof BloodPressureInitialDispatchAction) {
    return action.bloodPressureRecordings
  }

  const bloodPressureAction = action as BloodPressureDispatchAction

  switch (bloodPressureAction.actionType) {

    case BloodPressureDispatchActionType.NEW: {
      const newData = [...existingBloodPressureRecordings, bloodPressureAction.bloodPressureRecording];
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
  console.log("tee hee")
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
