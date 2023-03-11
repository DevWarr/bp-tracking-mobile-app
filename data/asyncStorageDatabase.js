import AsyncStorage from '@react-native-async-storage/async-storage';
import { BloodPressureRecording } from '../models';

/**
 * Save data to AsyncStorage
 * 
 * @param {BloodPressureRecording[]} data 
 */
export const saveData = async (data) => {
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
 * 
 * @returns {BloodPressureRecording[]}
 */
export const loadData = async () => {
  try {
    const data = await AsyncStorage.getItem('bpData');
    if (data !== null) {
      console.log('Data loaded from AsyncStorage');
      return JSON
        .parse(data)
        .map(bloodPressureJsonObject => BloodPressureRecording.buildFromJsonObject(bloodPressureJsonObject))
    } else {
      console.log('No data found in AsyncStorage');
      return [];
    }
  } catch (error) {
    console.error('Error loading data from AsyncStorage:', error);
    return [];
  }
};
