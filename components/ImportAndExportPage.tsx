import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  getStringAsync as getStringFromClipboardAsync,
  setStringAsync as setStringToClipboardAsync,
} from 'expo-clipboard';
import { useContext, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { AppStackParamList } from '../App';
import { BloodPressureInitialDispatchAction } from '../data/BloodPressureDispatchAction';
import { BloodPressureRecordingContext, BloodPressureRecordingDispatchContext } from '../data/BloodPressureRecordingProvider';
import { useErrorString } from '../hooks/useErrorString';
import { BloodPressureRecording } from '../models/BloodPressureRecording';
import BloodPressureRecordingJsonMapper from '../models/BloodPressureRecordingJsonMapper';
import { BloodPressureFlatList } from './BloodPressureFlatList/BloodPressureFlatList';


export const ImportAndExportPage = () => {
  const bloodPressureRecordings = useContext(BloodPressureRecordingContext)
  const dispatchBloodPressureRecordings = useContext(BloodPressureRecordingDispatchContext)
  const navigation = useNavigation<NavigationProp<AppStackParamList, "ImportAndExportPage">>();

  const [importData, setImportData] = useState<BloodPressureRecording[]>([]);
  const [importError, setImportError] = useErrorString()

  /**
   * Reaction when pressing "Import" button.
   *
   * Takes data from clipboard and attempts to import it into state.
   */
  const handleImportData = async () => {
    const stringData = await getStringFromClipboardAsync();
    try {
      const bloodPressureRecordingsFromImport = BloodPressureRecordingJsonMapper.buildBloodPressureRecordingListFromJsonString(stringData)
      setImportData(bloodPressureRecordingsFromImport);
    } catch (error) {
      setImportError("Invalid input. Are you sure you have valid data copied?")
    }
  };

  /**
   * Reaction when pressing "Save import data" button.
   *
   * Gives the user an alert, and if confirmed, saves data from state to memory.
   */
  const handleSaveImportData = () => {
    Alert.alert(
      "Are you sure you want to import?",
      "This will erase all existing data.\n\nIf you want to keep existing data, export and save before you import.",
      [
        {text: "Cancel", style: "cancel"},
        {text: "Save", onPress: saveData, style: "default"},
      ]
    )
  }

  /** Saves data from state to memory. */
  const saveData = () => {
    dispatchBloodPressureRecordings(
      new BloodPressureInitialDispatchAction(importData)
    )
    navigation.navigate("MainPage")
  }

  /**
   * Reaction when pressing "Export" button.
   *
   * Takes existing BP data from context and saves it as a JSON string to the user's clipboard.
   */
  const handleExportData = async () => {
    const jsonString = BloodPressureRecordingJsonMapper.buildJsonStringFromBloodPressureRecordingList(bloodPressureRecordings)
    await setStringToClipboardAsync(jsonString)
  }

  return (
    <View style={styles.container}>

      <View style={styles.section}>
        <Text style={styles.title}>Export Data</Text>
        <Text style={styles.description}>
          You can save all data as a JSON string to export from the app.
        </Text>
        <Button title="Export" onPress={handleExportData} />
      </View>

      <View style={styles.section}>

        <Text style={styles.title}>Import Data</Text>
        <Text style={styles.description}>
          Copy a JSON string to your clipboard, then click the import button to import the data.
        </Text>
        <Button title="Import" onPress={handleImportData} />
        <Text style={styles.error}>{importError}</Text>

        <View style={styles.importPreview}>
          <Text style={styles.subtitle}>Import Preview</Text>
            <BloodPressureFlatList bloodPressureRecordings={importData} isSwipeDisabled={true} />
          <Button title="Save import data" disabled={!importData.length} onPress={handleSaveImportData} />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  error: {
    padding: 10,
    marginBottom: 10,
    width: '80%',
    color: `#f00`,
  },
  importPreview: {
    marginBottom: 20,
    maxHeight: "50%",
  },
  description: {
    marginBottom: 10,
  },
  buttonContainer: {
    alignSelf: 'center',
  },
});
