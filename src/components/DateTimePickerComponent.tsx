import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { useState } from "react"
import { NativeSyntheticEvent, Platform, StyleSheet, TextInput, TextInputFocusEventData } from "react-native"
import { buildDateFromDateAndTime, formatDateAsYYYYMMDD, formatTimeFromDate } from "../conversions/dateTimeConversions"

interface IDateTimePickerComponentProps {
  dateOfRecording: Date;
  setDateOfRecording: React.Dispatch<React.SetStateAction<Date>>;
  stopIncrementingDateTime: () => void;
}

/**
 * Component that renders a date time picker with date display.
 *
 * Functional for both Android and non-Android.
 *
 * See more here: https://www.npmjs.com/package/@react-native-community/datetimepicker#usage
 */
export const DateTimePickerComponent = (
  {dateOfRecording, setDateOfRecording, stopIncrementingDateTime}: IDateTimePickerComponentProps
) => {

  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false)

  /**
   * Reaction when closing the 'time' picker for android.
   *
   * Sets the date of the blood pressure recording when complete.
   *
   * This function should have both the date and time passed in to produce a correct datetime.
   */
  const onDateChangeAndroid = (event: DateTimePickerEvent, dateObjectForDate: Date, dateObjectForTime: Date) => {
    if (event.type === "dismissed") return;

    setDateOfRecording(buildDateFromDateAndTime(dateObjectForDate, dateObjectForTime, dateObjectForTime.getTimezoneOffset()))
  }

  /**
   * Reaction when closing the 'time' picker for non-android devices.
   *
   * Sets the date of the blood pressure recording, and sets the picker to close.
   */
  const onDateChangeNotAndroid = (event: DateTimePickerEvent, selectedDate: Date) => {
    if (event.type === 'dismissed') {
      setIsDateTimePickerOpen(false)
      return;
    }
    setDateOfRecording(selectedDate)
    setIsDateTimePickerOpen(false)
  }

  /**
   * Reaction when pressing the text input for the date of the BP recording.
   *
   * If on Android, opens the android datetime picker.
   * If on any other platform, sets the modal state to true.
   */
  const onFocusDate = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    event.preventDefault()
    event.target.blur()
    stopIncrementingDateTime()
    if (Platform.OS === 'android') {
      openAndroidDatePicker()
    } else {
      setIsDateTimePickerOpen(true)
    }
  }

  /**
   * Opens the Android date picker.
   *
   * When the date picker is closed, the time picker function is called.
   */
  const openAndroidDatePicker = () => {
    DateTimePickerAndroid.open({
      value: dateOfRecording,
      mode: 'date',
      onChange: openAndroidTimePicker
    })
  }

  /**
   * Opens the Android time picker.
   *
   * When the time picker is closed,
   * the date objects from the date and time picker are sent to the date change function.
   */
  const openAndroidTimePicker = (datePickerEvent: DateTimePickerEvent, dateObjectForDate: Date) => {
    if (datePickerEvent.type === "dismissed") return;

    DateTimePickerAndroid.open({
      value: dateOfRecording,
      mode: 'time',
      onChange: (timePickerEvent, dateObjectForTime) => onDateChangeAndroid(timePickerEvent, dateObjectForDate, dateObjectForTime)
    })
  }

  return (
    <>
      <TextInput
        style={[styles.input, styles.dateTimeInput]}
        value={`${formatDateAsYYYYMMDD(dateOfRecording)}   ${formatTimeFromDate(dateOfRecording, false)}`}
        showSoftInputOnFocus={false}
        onFocus={onFocusDate}
      />
      {(Platform.OS === 'ios' && isDateTimePickerOpen) &&
        <DateTimePicker
          mode="datetime"
          value={dateOfRecording}
          onChange={onDateChangeNotAndroid}
        />
      }
    </>
  )
}

const styles = StyleSheet.create({
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
})
