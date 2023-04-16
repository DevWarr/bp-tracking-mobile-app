import { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { NavigationProp, Route, useNavigation } from '@react-navigation/native';
import { BloodPressureRecording } from '../../models/BloodPressureRecording';
import { BloodPressureRecordingContext, BloodPressureRecordingDispatchContext } from '../../data/BloodPressureRecordingProvider';
import { BloodPressureDispatchAction, BloodPressureDispatchActionType } from '../../data/BloodPressureDispatchAction';
import { AppStackParamList } from '../../App';
import { useErrorString } from '../../hooks/useErrorString';
import { useNumberState } from '../../hooks/useNumberState';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useIncrementingDateTime } from '../../hooks/useIncrementingDate';
import { formatDateAsYYYYMMDD, formatTimeFromDate } from '../../models/conversions';
import { selectBloodPressureToEdit } from '../../hooks/selectBloodPressureToEdit';

export interface IBloodPressureRecordingFormRouteParams {
  bloodPressureRecordingIdToEdit?: string
}

interface IBloodPressureRecordingFormProps {
  route?: Route<"BloodPressureRecordingForm", IBloodPressureRecordingFormRouteParams>
}

export const BloodPressureRecordingForm = ({ route }: IBloodPressureRecordingFormProps) => {

  const {isEditing, bloodPressureRecordingToEdit} = selectBloodPressureToEdit(route?.params?.bloodPressureRecordingIdToEdit)
  const bloodPressureRecordingDispatch = useContext(BloodPressureRecordingDispatchContext)

  const navigation = useNavigation<NavigationProp<AppStackParamList, "BloodPressureRecordingForm">>();
  const navigateToMainPage = () => {
    navigation.navigate('MainPage');
  };

  const [dateOfRecording,  setDateOfRecording, stopIncrementingDateTime] = useIncrementingDateTime(isEditing ? bloodPressureRecordingToEdit.date : new Date(), isEditing);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState<boolean>(false);

  const [systolic,   setSystolic  ] = useNumberState(isEditing ? bloodPressureRecordingToEdit.systolic.toString() : '');
  const [diastolic,  setDiastolic ] = useNumberState(isEditing ? bloodPressureRecordingToEdit.diastolic.toString() : '');
  const [heartRate,  setHeartRate ] = useNumberState(isEditing ? bloodPressureRecordingToEdit.heartRate.toString() : '');
  const [notes,      setNotes     ] = useState((isEditing && bloodPressureRecordingToEdit.notes) ? bloodPressureRecordingToEdit.notes : '');
  const [errorText,  setErrorText ] = useErrorString();

  const systolicInputRef:   React.MutableRefObject<TextInput | null> = useRef(null);
  const diastolicInputRef:  React.MutableRefObject<TextInput | null> = useRef(null);
  const heartRateInputRef:  React.MutableRefObject<TextInput | null> = useRef(null);
  const notesInputRef:      React.MutableRefObject<TextInput | null> = useRef(null);

  useEffect(() => {
    // If we're making a new BP recording, add focus so it's easier to just enter a recording
    if (!isEditing) {
      systolicInputRef.current?.focus()
    }
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
      dateOfRecording,
      Number(systolic),
      Number(diastolic),
      Number(heartRate),
      notes
    )

    const dispatchAction = new BloodPressureDispatchAction(
      isEditing? BloodPressureDispatchActionType.EDITED : BloodPressureDispatchActionType.NEW,
      newBloodPressureRecording
    )

    bloodPressureRecordingDispatch(dispatchAction);
    navigateToMainPage();
  }

  const formHeaderText = isEditing ? "Edit Blood Pressure" : "New BP Recording"

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{formHeaderText}</Text>
      <TextInput
        style={[styles.input, styles.dateTimeInput]}
        value={`${formatDateAsYYYYMMDD(dateOfRecording)}   ${formatTimeFromDate(dateOfRecording, false)}`}
        editable={false}
        showSoftInputOnFocus={false}
        onFocus={(event) => {
          event.preventDefault()
          event.target.blur()
          setIsDateTimeModalOpen(true)
          stopIncrementingDateTime()
        }}
      />
      <DateTimePickerModal
        mode="datetime"
        isVisible={isDateTimeModalOpen}
        date={dateOfRecording}
        onConfirm={(date: Date) => {
          setDateOfRecording(date)
          setIsDateTimeModalOpen(false)
        }}
        onCancel={() => setIsDateTimeModalOpen(false)}
      />
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
      <Text style={styles.error}>{errorText}</Text>
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
  dateTimeInput: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30
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
