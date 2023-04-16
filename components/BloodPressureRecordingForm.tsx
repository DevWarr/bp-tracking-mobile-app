import { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BloodPressureRecording } from '../models/BloodPressureRecording';
import { BloodPressureRecordingDispatchContext } from '../data/BloodPressureRecordingProvider';
import { BloodPressureDispatchAction, BloodPressureDispatchActionType } from '../data/BloodPressureDispatchAction';
import { AppStackParamList } from '../App';
import { useErrorString } from '../hooks/useErrorString';
import { convertDateToDateStringAndTimeOfDay } from '../models/conversions';

export const BloodPressureRecordingForm = () => {
  const bloodPressureRecordingDispatch = useContext(BloodPressureRecordingDispatchContext)
  const navigation = useNavigation<NavigationProp<AppStackParamList, "BloodPressureRecordingForm">>();

  const navigateToMainPage = () => {
    navigation.navigate('MainPage');
  };

  const [errorText,  setErrorText ] = useErrorString();
  const [systolic,   setSystolic  ] = useState('');
  const [diastolic,  setDiastolic ] = useState('');
  const [heartRate,  setHeartRate ] = useState('');
  const [notes,      setNotes     ] = useState('');

  const systolicInputRef:  React.MutableRefObject<TextInput | null> = useRef(null);
  const diastolicInputRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const heartRateInputRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const notesInputRef:     React.MutableRefObject<TextInput | null> = useRef(null);

  useEffect(() => {
    systolicInputRef.current?.focus()
  }, [])

  const isValidNumber = (inputString: string): boolean => {
    const numberValue = Number(inputString) 
    return (
      !isNaN(numberValue) &&
      !!numberValue &&
      Number.isSafeInteger(numberValue)
    )
  }

  const handleAddNewBloodPressureRecording = () => {
    if (!isValidNumber(systolic) || !isValidNumber(diastolic) || !isValidNumber(heartRate)) {
      setErrorText("Please fill out first three fields with valid numbers.");
      return;
    }

    const newBloodPressureRecording = new BloodPressureRecording(
      new Date(),
      Number(systolic),
      Number(diastolic),
      Number(heartRate),
      notes
    )

    const dispatchAction = new BloodPressureDispatchAction(
      BloodPressureDispatchActionType.NEW,
      newBloodPressureRecording
    )

    bloodPressureRecordingDispatch(dispatchAction);
    navigateToMainPage();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New BP Recording</Text>
      <Text style={styles.error}>{errorText}</Text>
      <TextInput
        style={styles.input}
        placeholder="Systolic"
        keyboardType="numeric"
        returnKeyType="next"
        onChangeText={(text: string) => setSystolic(text)}
        value={systolic}
        ref={systolicInputRef}
        onSubmitEditing={() => {
          diastolicInputRef.current?.focus();
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Diastolic"
        keyboardType="numeric"
        returnKeyType="next"
        onChangeText={(text: string) => setDiastolic(text)}
        value={diastolic}
        ref={diastolicInputRef}
        onSubmitEditing={() => {
          heartRateInputRef.current?.focus();
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Heart rate"
        keyboardType="numeric"
        returnKeyType="next"
        onChangeText={(text: string) => setHeartRate(text)}
        value={heartRate}
        ref={heartRateInputRef}
        onSubmitEditing={() => {
          notesInputRef.current?.focus();
        }}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Notes (optional)"
        multiline
        numberOfLines={4}
        onChangeText={(text: string) => setNotes(text)}
        value={notes}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddNewBloodPressureRecording}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  error: {
    padding: 10,
    marginBottom: 10,
    width: '80%',
    fontSize: 16,
    color: `#f00`,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
