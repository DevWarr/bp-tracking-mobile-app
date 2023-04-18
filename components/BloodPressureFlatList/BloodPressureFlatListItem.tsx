import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { memo, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { BloodPressureRecording } from '../../models/BloodPressureRecording';

interface IBloodPressureFlatListItemProps {
  item: BloodPressureRecording;
  onEdit: (bloodPressureRecording: BloodPressureRecording) => void;
  onDelete: (bloodPressureRecording: BloodPressureRecording) => void;
  swipedComponentId: string;
  setSwipedComponentId: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Renders a single BloodPressure Recording as a row
 */
const BloodPressureFlatListItem = ({ item, onEdit, onDelete, swipedComponentId, setSwipedComponentId }: IBloodPressureFlatListItemProps) => {
  const [isShowingNotes, setIsShowingNotes] = useState(false)
  const swipeableRef = useRef<Swipeable>(null)

  useEffect(() => {
    if (swipedComponentId !== item.id) {
      swipeableRef.current.close()
    }
  }, [swipedComponentId])

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

  const renderRightActions = () => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
          <MaterialCommunityIcons name="lead-pencil" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item)} style={styles.deleteButton}>
          <MaterialCommunityIcons name="trash-can-outline" size={32} color="black"/>
        </TouchableOpacity>
      </View>
    )
  }

  // TODO: Make the pressable component change opacity when pressing and NOT swiping
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootFriction={8}
      ref={swipeableRef}
      onSwipeableWillOpen={() => setSwipedComponentId(item.id)}
    >
      <Pressable
        style={styles.tableRow}
        onPress={() => {
          setSwipedComponentId("")
          if (!item.notes) return;
          setIsShowingNotes(!isShowingNotes)
        }}
      >
        {isShowingNotes ? renderNotes() : renderBloodPressureInfo()}
        <Ionicons name="chatbubble-sharp" color={item.notes ? "black" : "lightgray"} size={28} />
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    backgroundColor: "white",
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
    alignItems: 'center',
    width: 100,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    height: "100%",
    width: "50%",
  },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3c3",
    height: "100%",
    width: "50%",
  }
})

const memoizedBloodPressureFlatListItem = memo(BloodPressureFlatListItem, (prevProps, newProps) => {
  // If the item itself changes, re-render (props are NOT equal, return false)
  if (prevProps.item.id !== newProps.item.id) return false;

  // If the swipedItem changes and it WAS or IS the item id,
  // we want to close the swipe, so we should re-render (props are NOT equal, return false)
  if (
    prevProps.swipedComponentId !== newProps.swipedComponentId &&
    (prevProps.swipedComponentId === newProps.item.id || newProps.swipedComponentId === newProps.item.id)
  ) {
    return false;
  }

  // If any function signatures change, re-render (props are NOT equal, return false)
  if (prevProps.onEdit !== newProps.onEdit || prevProps.onDelete !== newProps.onDelete || prevProps.setSwipedComponentId !== newProps.setSwipedComponentId) {
    return false;
  }
  // Otherwise, don't re-render (props ARE equal, return true)
  return true;
})

export {
  memoizedBloodPressureFlatListItem as BloodPressureFlatListItem
}
