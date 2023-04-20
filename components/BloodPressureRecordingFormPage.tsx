import { useNavigation, NavigationProp, Route } from '@react-navigation/native';
import { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppStackParamList } from '../App';
import { BloodPressureDispatchAction, BloodPressureDispatchActionType } from '../data/BloodPressureDispatchAction';
import { BloodPressureRecordingDispatchContext } from '../data/BloodPressureRecordingProvider';
import { selectBloodPressureToEdit } from '../hooks/selectBloodPressureToEdit';
import { useErrorString } from '../hooks/useErrorString';
import { useIncrementingDateTime } from '../hooks/useIncrementingDate';
import { useNumberState } from '../hooks/useNumberState';
import { BloodPressureRecording } from '../models/BloodPressureRecording';
import { DateTimePickerComponent } from './DateTimePickerComponent';

export interface IBloodPressureRecordingFormRouteParams {
  /**
   * ID of the Blood Pressure recording to edit.
   *
   * If this value is undefined or null, then we're creating a new Blood Pressure recording.
   */
  bloodPressureRecordingIdToEdit?: string
}

interface IBloodPressureRecordingFormProps {
  route?: Route<"BloodPressureRecordingForm", IBloodPressureRecordingFormRouteParams>
}

export const BloodPressureRecordingFormPage = ({ route }: IBloodPressureRecordingFormProps) => {

  const {isEditing, bloodPressureRecordingToEdit} = selectBloodPressureToEdit(route?.params?.bloodPressureRecordingIdToEdit)
  const bloodPressureRecordingDispatch = useContext(BloodPressureRecordingDispatchContext)

  const navigation = useNavigation<NavigationProp<AppStackParamList, "BloodPressureRecordingForm">>();
  const navigateToMainPage = () => {
    navigation.navigate('MainPage');
  };

  const [dateOfRecording,  setDateOfRecording, stopIncrementingDateTime] = useIncrementingDateTime(isEditing ? bloodPressureRecordingToEdit.date : new Date(), isEditing);

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

  /** Validation function that checks if something is a valid number. */
  const isValidNumber = (inputString: string): boolean => {
    const numberValue = Number(inputString)
    return (
      !isNaN(numberValue) &&
      !!numberValue &&
      Number.isSafeInteger(numberValue)
    )
  }

  /**
   * Builds a dispatch action to edit a BP recording.
   *
   * NOTE: This action modifies the BP recording itself before dispatch.
   */
  const buildEditBloodPressureDispatchAction = (): BloodPressureDispatchAction => {
    bloodPressureRecordingToEdit.date = dateOfRecording
    bloodPressureRecordingToEdit.systolic = Number(systolic)
    bloodPressureRecordingToEdit.diastolic = Number(diastolic)
    bloodPressureRecordingToEdit.heartRate = Number(heartRate)
    bloodPressureRecordingToEdit.notes = notes
    bloodPressureRecordingToEdit.auditFields.lastUpdatedDateTime = new Date()

    return new BloodPressureDispatchAction(BloodPressureDispatchActionType.EDITED, bloodPressureRecordingToEdit)
  }

  /** Builds a dispatch action to create a new BP recording. */
  const buildNewBloodPressureAction = (): BloodPressureDispatchAction => {
    const newBloodPressureRecording = new BloodPressureRecording(
      dateOfRecording,
      Number(systolic),
      Number(diastolic),
      Number(heartRate),
      notes
    )

    return new BloodPressureDispatchAction(BloodPressureDispatchActionType.NEW, newBloodPressureRecording)
  }

  /**
   * Reaction to pressing the "Add" or "Update" button on the form.
   *
   * This function:
   *
   * 1. Validates the form fields
   * 2. Creates a BloodPressureDispatchAction from the form fields
   * 3. Dispatches the action
   * 4. Navigates back to the main page
   */
  const handleSubmit = () => {
    if (!isValidNumber(systolic) || !isValidNumber(diastolic) || !isValidNumber(heartRate)) {
      setErrorText("Please fill out first three fields with valid numbers.");
      return;
    }

    const dispatchAction = isEditing ? buildEditBloodPressureDispatchAction() : buildNewBloodPressureAction()
    bloodPressureRecordingDispatch(dispatchAction);
    navigateToMainPage();
  }

  const formHeaderText = isEditing ? "Update Blood Pressure" : "New BP Recording"

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{formHeaderText}</Text>
      <DateTimePickerComponent
        dateOfRecording={dateOfRecording}
        setDateOfRecording={setDateOfRecording}
        stopIncrementingDateTime={stopIncrementingDateTime}
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
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{isEditing ? "Update" : "Add"}</Text>
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
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
