import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from 'react';

/**
   * Renders a single BloodPressure Recording as a row
   * 
   * @param {{item: BloodPressureRecording}} param0 
   */
export const BloodPressureFlatListItem = ({ item }) => {

  const [shouldShowNotes, setShouldShowNotes] = useState(false)

  const renderBloodPressureInfo = () => (
    <>
      <Text style={[styles.rowText, styles.datetime]}>{item.getDateInfo()}</Text>
      <Text style={[styles.rowText, styles.bloodPressure]}>
        {item.systolic} / {item.diastolic}
      </Text>
      <Text style={[styles.rowText, styles.heartRate]}>{item.heartRate}</Text>
    </>
  )

  const renderNotes = () => <Text style={styles.rowText}>{item.notes}</Text>

  return (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => {
        if (!item.notes) return;
        setShouldShowNotes(!shouldShowNotes)
      }}
    >
      {shouldShowNotes ? renderNotes() : renderBloodPressureInfo()}
      <Ionicons name="chatbubble-sharp" color={item.notes ? "black" : "lightgray"} size={28} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rowText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
})
