import AsyncStorage from '@react-native-async-storage/async-storage';
import { BloodPressureRecording } from '../models/BloodPressureRecording';
import BloodPressureRecordingJsonMapper from '../models/BloodPressureRecordingJsonMapper';

/**
 * Save data to AsyncStorage
 *
 * TODO: If an error occurs, that should surface on the app somewhere
 */
export const saveData = async (data: BloodPressureRecording[]): Promise<void> => {
  if (!data) return;

  const jsonString = BloodPressureRecordingJsonMapper.buildJsonStringFromBloodPressureRecordingList(data)
  try {
    await AsyncStorage.setItem('bpData', jsonString);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving data to AsyncStorage:', error);
  }
};

/**
 * Load data from AsyncStorage
 *
 * TODO: If no data is loaded, should that surface an error?
 * TODO: If an error occurs, that should surface on the app somewhere
 */
export const loadData = async (): Promise<BloodPressureRecording[]> => {
  try {
    const data = await AsyncStorage.getItem('bpData');

    if (data == null) {
      // eslint-disable-next-line no-console
      console.warn('No data found in AsyncStorage');
      return [];
    }

    return BloodPressureRecordingJsonMapper.buildBloodPressureRecordingListFromJsonString(data)

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading data from AsyncStorage:', error);
    return [];
  }
};
