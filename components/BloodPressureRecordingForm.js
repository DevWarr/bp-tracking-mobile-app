import { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BloodPressureRecording } from '../models';
import { BloodPressureRecordingDispatchContext } from '../data/BloodPressureRecordingProvider';
import { BloodPressureDispatchAction, BloodPressureDispatchActionType } from '../data/BloodPressureDispatchAction';

export const BloodPressureRecordingForm = () => {
  const bloodPressureRecordingDispatch = useContext(BloodPressureRecordingDispatchContext)
  const navigation = useNavigation();

  const navigateToMainPage = () => {
    navigation.navigate('MainPage');
  };

  const [errorText, setErrorText] = useState(' ');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [notes, setNotes] = useState('');

  const systolicInputRef = useRef(null);
  const diastolicInputRef = useRef(null);
  const heartRateInputRef = useRef(null);

  useEffect(() => {
    if (!errorText.trim()) return;

    setTimeout(() => setErrorText(' '), 2000)

  }, [errorText])

  const handleAddNewBloodPressureRecording = () => {
    if (!systolic || !diastolic || !heartRate) {
      setErrorText("Please fill out first three fields.");
      return;
    }

    const dispatchAction = new BloodPressureDispatchAction(
      BloodPressureDispatchActionType.NEW,
      new BloodPressureRecording(systolic, diastolic, heartRate, notes)
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
        onChangeText={(text) => setSystolic(text)}
        value={systolic}
        ref={systolicInputRef}
        onSubmitEditing={() => {
          diastolicInputRef.current.focus();
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Diastolic"
        keyboardType="numeric"
        returnKeyType="next"
        onChangeText={(text) => setDiastolic(text)}
        value={diastolic}
        ref={diastolicInputRef}
        onSubmitEditing={() => {
          heartRateInputRef.current.focus();
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Heart rate"
        keyboardType="numeric"
        returnKeyType="next"
        onChangeText={(text) => setHeartRate(text)}
        value={heartRate}
        ref={heartRateInputRef}
        onSubmitEditing={() => {
          heartRateInputRef.current.focus();
        }}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Notes (optional)"
        multiline
        numberOfLines={4}
        onChangeText={(text) => setNotes(text)}
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
