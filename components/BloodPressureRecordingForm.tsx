import { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BloodPressureRecording } from '../models/BloodPressureRecording';
import { BloodPressureRecordingDispatchContext } from '../data/BloodPressureRecordingProvider';
import { BloodPressureDispatchAction, BloodPressureDispatchActionType } from '../data/BloodPressureDispatchAction';
import { AppStackParamList } from '../App';
import { useErrorString } from '../hooks/useErrorString';
import { convertDateToDateStringAndTimeOfDay, formatDateAsYYYYMMDD, getTimeOfDayFromDate } from '../models/conversions';
import { useNumberState } from '../hooks/useNumberState';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { TimeOfDay } from '../models/BloodPressureRecording';

export const BloodPressureRecordingForm = () => {
  const bloodPressureRecordingDispatch = useContext(BloodPressureRecordingDispatchContext)
  const navigation = useNavigation<NavigationProp<AppStackParamList, "BloodPressureRecordingForm">>();

  const navigateToMainPage = () => {
    navigation.navigate('MainPage');
  };

  const [dateOfRecording,      setDateOfRecording     ] = useState(new Date());
  const [isDateModalOpen,      setIsDateModalOpen     ] = useState<boolean>(false);
  const [timeOfDayOfRecording, setTimeOfDayOfRecording] = useState<TimeOfDay>(getTimeOfDayFromDate(new Date()));

  const [systolic,   setSystolic  ] = useNumberState('');
  const [diastolic,  setDiastolic ] = useNumberState('');
  const [heartRate,  setHeartRate ] = useNumberState('');
  const [notes,      setNotes     ] = useState('');
  const [errorText,  setErrorText ] = useErrorString();

  const systolicInputRef:   React.MutableRefObject<TextInput | null> = useRef(null);
  const diastolicInputRef:  React.MutableRefObject<TextInput | null> = useRef(null);
  const heartRateInputRef:  React.MutableRefObject<TextInput | null> = useRef(null);
  const notesInputRef:      React.MutableRefObject<TextInput | null> = useRef(null);

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

    const {dateString, timeOfDay} = convertDateToDateStringAndTimeOfDay(new Date())
    const newBloodPressureRecording = new BloodPressureRecording(
      dateString,
      timeOfDay,
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
      {/* Needs styles */}
      <View>
        <TextInput
          value={formatDateAsYYYYMMDD(dateOfRecording)}
          onChangeText={() => {}}
          showSoftInputOnFocus={false}
          onFocus={(event) => {
            event.preventDefault()
            event.target.blur()
            setIsDateModalOpen(true)
          }}
        />
        <DateTimePickerModal
          mode="date"
          isVisible={isDateModalOpen}
          date={dateOfRecording}
          onConfirm={(date: Date) => {
            console.log(date)
            setIsDateModalOpen(false)
            setDateOfRecording(date)
          }}
          onCancel={() => setIsDateModalOpen(false)}
        />
        <RNPickerSelect
          onValueChange={(value: TimeOfDay) => console.log(value)}
          value={timeOfDayOfRecording}
          items={[
              { label: TimeOfDay.MORNING, value: TimeOfDay.MORNING },
              { label: TimeOfDay.EVENING, value: TimeOfDay.EVENING },
          ]}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Systolic"
        keyboardType="numeric"
        returnKeyType="next"
        onChangeText={setSystolic}
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
        onChangeText={setDiastolic}
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
        onChangeText={setHeartRate}
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
        ref={notesInputRef}
        onChangeText={setNotes}
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
