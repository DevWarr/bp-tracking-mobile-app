import AsyncStorage from '@react-native-async-storage/async-storage';
import { IBloodPressureJsonObject, BloodPressureRecording, BloodPressureMappingError } from '../models/BloodPressureRecording';

/**
 * Save data to AsyncStorage
 */
export const saveData = async (data: BloodPressureRecording[]): Promise<void> => {
  if (!data) return;

  const jsonData = data.map(bloodPressureRecording => bloodPressureRecording.buildJsonObject())
  const jsonString = JSON.stringify(jsonData)
  console.log(jsonString)

  try {
    await AsyncStorage.setItem('bpData', jsonString);
    console.log('Data saved to AsyncStorage');
  } catch (error) {
    console.error('Error saving data to AsyncStorage:', error);
  }
};

/**
 * Load data from AsyncStorage
 */
export const loadData = async (): Promise<BloodPressureRecording[]> => {
  try {
    const data = await AsyncStorage.getItem('bpData');
    if (data !== null) {
      console.log('Data loaded from AsyncStorage');
      return JSON
        .parse(data)
        .map((bloodPressureJsonObject: IBloodPressureJsonObject) => BloodPressureRecording.buildFromJsonObject(bloodPressureJsonObject))
    } else {
      console.log('No data found in AsyncStorage');
      return [];
    }
  } catch (error) {
    if (error instanceof BloodPressureMappingError) {
      console.error({
        error: 'Error mapping JSON data',
        errorMessage: error.message,
        errorInputJson: 
        error.inputJson
      });
    }
    console.error('Error loading data from AsyncStorage:', error);
    return [];
  }
};
