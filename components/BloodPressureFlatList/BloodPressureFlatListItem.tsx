import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from 'react';
import { BloodPressureRecording } from '../../models/BloodPressureRecording';

/**
 * Renders a single BloodPressure Recording as a row
 */
export const BloodPressureFlatListItem = ({ item }: { item: BloodPressureRecording; }) => {

  const [shouldShowNotes, setShouldShowNotes] = useState(false)

  const renderBloodPressureInfo = () => (
    <>
      <Text style={styles.rowText}>{item.dateInfo}</Text>
      <Text style={styles.rowText}>
        {item.systolic} / {item.diastolic}
      </Text>
      <Text style={styles.rowText}>{item.heartRate}</Text>
    </>
  )

  const renderNotes = () => <Text style={[styles.rowText, styles.notes]}>{item.notes}</Text>

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
    textAlign: 'center',
  },
  notes: {
    flex: 1,
  },
})
