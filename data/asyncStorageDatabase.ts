import AsyncStorage from '@react-native-async-storage/async-storage';
import { BloodPressureRecording } from '../models/BloodPressureRecording';
import BloodPressureRecordingJsonMapper from '../models/BloodPressureRecordingJsonMapper';

/**
 * Save data to AsyncStorage
 */
export const saveData = async (data: BloodPressureRecording[]): Promise<void> => {
  if (!data) return;

  const jsonString = BloodPressureRecordingJsonMapper.buildJsonStringFromBloodPressureRecordingList(data)
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

    if (data == null) {
      console.warn('No data found in AsyncStorage');
      return [];
    }

    console.log('Data loaded from AsyncStorage');
    return BloodPressureRecordingJsonMapper.buildBloodPressureRecordingListFromJsonString(data)

  } catch (error) {

    console.error('Error loading data from AsyncStorage:', error);
    return [];
  }
};
