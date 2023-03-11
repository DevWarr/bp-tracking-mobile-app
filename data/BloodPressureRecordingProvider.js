import { createContext, useEffect, useReducer } from "react";
import { BloodPressureRecording } from "../models";
import { loadData, saveData } from "./asyncStorageDatabase";
import { BloodPressureDispatchAction, BloodPressureDispatchActionType, BloodPressureInitialDispatchAction } from "./BloodPressureDispatchAction";

export const BloodPressureRecordingContext = createContext(null)
export const BloodPressureRecordingDispatchContext = createContext(null)

/**
 * Reducer to handle different actions that can change blood pressure recordings
 * 
 * @param {BloodPressureRecording[]} existingBloodPressureRecordings
 * @param {BloodPressureDispatchAction | BloodPressureInitialDispatchAction} action 
 * @returns 
 */
const bloodPressureRecordingReducer = (existingBloodPressureRecordings, action) => {
  console.log(action)
  if (action instanceof BloodPressureInitialDispatchAction) {
    return action.bloodPressureRecordings
  }

  switch (action.actionType) {

    case BloodPressureDispatchActionType.NEW: {
      const newData = [...existingBloodPressureRecordings, action.bloodPressureRecording];
      saveData(newData);
      return newData;
    }

    case BloodPressureDispatchActionType.EDITED: {
      const newData = existingBloodPressureRecordings.map(singleBloodPressureRecording => {
        if (singleBloodPressureRecording.id === action.bloodPressureRecording.id) {
          return action.bloodPressureRecording;
        } else {
          return singleBloodPressureRecording;
        }
      })
      saveData(newData);
      return newData;
    }

    case BloodPressureDispatchActionType.DELETED: {
      const newData = existingBloodPressureRecordings.filter(singleBloodPressureRecording => 
        singleBloodPressureRecording.id !== action.bloodPressureRecording.id
      );
      saveData(newData);
      return newData;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

/**
 * React Context Provider for managing blood pressure recordings
 * 
 * @param {{}} param0 
 */
export const BloodPressureRecordingProvider = ({ children }) => {
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
