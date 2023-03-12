import React, { useContext, useState } from 'react';
import { Alert, View, Text, Button, StyleSheet } from 'react-native';
import {
  setStringAsync as setStringToClipboardAsync,
  getStringAsync as getStringFromClipboardAsync,
} from 'expo-clipboard';
import { BloodPressureRecordingContext, BloodPressureRecordingDispatchContext } from '../data/BloodPressureRecordingProvider';
import { BloodPressureRecording, IBloodPressureJsonObject } from '../models/BloodPressureRecording';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../App';
import { BloodPressureFlatList } from './BloodPressureFlatList/BloodPressureFlatList';
import { BloodPressureInitialDispatchAction } from '../data/BloodPressureDispatchAction';
import { useErrorString } from '../hooks/useErrorString';

export const ImportAndExportPage: React.FC = () => {
  const bloodPressureRecordings = useContext(BloodPressureRecordingContext)
  const dispatchBloodPressureRecordings = useContext(BloodPressureRecordingDispatchContext)
  const navigation = useNavigation<NavigationProp<AppStackParamList, "ImportAndExportPage">>();

  const [importData, setImportData] = useState<BloodPressureRecording[]>([]);
  const [importError, setImportError] = useErrorString()

  const handleImportData = async () => {
    const stringData = await getStringFromClipboardAsync();
    try {
      const jsonData = JSON.parse(stringData) as IBloodPressureJsonObject[];
      const bloodPressureRecordings = jsonData.map(BloodPressureRecording.buildFromJsonObject)
      setImportData(bloodPressureRecordings);
    } catch (error) {
      setImportError("Invalid input. Are you sure you have valid data copied?")
    }
  };

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

  const saveData = () => {
    dispatchBloodPressureRecordings(
      new BloodPressureInitialDispatchAction(importData)
    )
    navigation.navigate("MainPage")
  }

  const handleExportData = async () => {
    const jsonObjects = bloodPressureRecordings.map((it) => it.buildJsonObject())
    const jsonString = JSON.stringify(jsonObjects)
    await setStringToClipboardAsync(jsonString)
    console.log("copied!")
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
          {importData.length ? 
            <BloodPressureFlatList bloodPressureRecordings={importData} />
            :
            <Text style={styles.description}>(See a preview of your data before importing)</Text>
          }
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
