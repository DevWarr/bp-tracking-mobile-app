import { Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from 'react';
import { BloodPressureRecording } from '../../models/BloodPressureRecording';
import { Swipeable } from 'react-native-gesture-handler';

interface IBloodPressureFlatListItemProps {
  item: BloodPressureRecording;
  onEdit: (bloodPressureRecording: BloodPressureRecording) => void;
  onDelete: (bloodPressureRecording: BloodPressureRecording) => void;
}

/**
 * Renders a single BloodPressure Recording as a row
 */
export const BloodPressureFlatListItem = ({ item, onEdit, onDelete }: IBloodPressureFlatListItemProps) => {

  const [isShowingNotes, setIsShowingNotes] = useState(false)

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

  const renderRightActions = (progressAnimatedValue: Animated.AnimatedInterpolation<string>, dragAnimatedValue: Animated.AnimatedInterpolation<string>) => {
    const translation = dragAnimatedValue.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <Animated.View style={[styles.rightActions, {transform: [{translateX: translation}]}]}>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Ionicons name="pencil-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item)}>
          <Ionicons name="trash-outline" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>
    )
  }


  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={styles.tableRow}
        onPress={() => {
          if (!item.notes) return;
          setIsShowingNotes(!isShowingNotes)
        }}
      >
        {isShowingNotes ? renderNotes() : renderBloodPressureInfo()}
        <Ionicons name="chatbubble-sharp" color={item.notes ? "black" : "lightgray"} size={28} />
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    // backgroundColor: "white",
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
  rightActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'red',
    width: 100,
  },
})
