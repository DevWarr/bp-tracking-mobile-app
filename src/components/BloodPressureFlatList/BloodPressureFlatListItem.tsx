import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { memo, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { BloodPressureRecording } from '../../models/BloodPressureRecording';
import { buildColorStyleFromBloodPressure } from '../../conversions/bloodPressureStyles';

interface IBloodPressureFlatListItemProps {
  item: BloodPressureRecording;
  /** Function to call when the edit button is pressed. */
  onEdit: (bloodPressureRecording: BloodPressureRecording) => void;
  /** Function to call when the delete button is pressed. */
  onDelete: (bloodPressureRecording: BloodPressureRecording) => void;
  /**
   * ID of the flatlist item that's currently swiped.
   *
   * If this component's ID doesn't match the swipedComponentId,
   * this component should not be swiped open.
   */
  selectedComponentId: string;
  setSelectedComponentId: React.Dispatch<React.SetStateAction<string>>;
  isSwipeDisabled: boolean
}

/**
 * Renders a single BloodPressure Recording as a row.
 *
 * NOTE: The exported component is the memoized flat list item below this function.
 */
const BloodPressureFlatListItem = (
  { item, onEdit, onDelete, selectedComponentId, setSelectedComponentId, isSwipeDisabled }: IBloodPressureFlatListItemProps
) => {

  const [isShowingNotes, setIsShowingNotes] = useState(false)
  const swipeableRef = useRef<Swipeable>(null)
  const bloodPressureColorStyle = buildColorStyleFromBloodPressure(item.systolic, item.diastolic)

  useEffect(() => {
    if (selectedComponentId !== item.id) {
      swipeableRef.current.close()
      setIsShowingNotes(false)
    }
  }, [selectedComponentId])

  /**
   * Reaction to pressing a single flat list item.
   *
   * This function will:
   *
   * 1. Set the swiped component ID to nothing (causing other swiped components to close)
   * 2. Display notes for this item, if notes exist.
   */
  const onPress = () => {
    setSelectedComponentId(item.id)
    if (!item.notes) return;
    setIsShowingNotes(!isShowingNotes)
  }

  const renderBloodPressureInfo = (shouldShowNotes: boolean) => (
    <Swipeable
      enabled={!isSwipeDisabled}
      renderRightActions={renderRightActions}
      overshootFriction={8}
      ref={swipeableRef}
      onSwipeableWillOpen={() => setSelectedComponentId(item.id)}
    >
      <View style={styles.topView}>

        <View style={styles.topViewSection}>
          <View style={styles.bloodPressureView}>
            <View style={styles.bloodPressureValueView}>
              <Text style={styles.bloodPressureValueLabelText}>SYS</Text>
              <Text style={[styles.bloodPressureValueText, bloodPressureColorStyle]}>{item.systolic}</Text>
            </View>
            <Text style={styles.bloodPressureSpacer}>/</Text>
            <View style={styles.bloodPressureValueView}>
              <Text style={styles.bloodPressureValueLabelText}>DIA</Text>
              <Text style={[styles.bloodPressureValueText, bloodPressureColorStyle]}>{item.diastolic}</Text>
            </View>
          </View>
        </View>

        <View style={styles.topViewSection}>
          <View style={[styles.bloodPressureView, {marginRight: 24}]}>
            <View style={{marginBottom: 8, marginRight: 4}}>
              <MaterialCommunityIcons name="heart-pulse" size={28} color="red" />
            </View>
            <View style={styles.bloodPressureValueView}>
              <Text style={styles.bloodPressureValueLabelText}>BPM</Text>
              <Text style={[styles.bloodPressureValueText, {textAlign: "center"}]}>{item.heartRate}</Text>
            </View>
          </View>
          <View style={[styles.notesIcon]}>
            <MaterialIcons name="comment" color={item.notes ? "black" : "lightgray"} size={28} />
          </View>
        </View>

      </View>
      {!shouldShowNotes && <Text style={styles.bloodPressureDate}>{item.dateInfo}</Text>}
    </Swipeable>
  )

  const renderNotes = () => (
    <View style={{marginTop: 16}}>
      <View style={[styles.bloodPressureValueView, {marginTop: 8}]}>
        <Text style={[styles.bloodPressureValueLabelText, {textAlign: "left"}]}>NOTES</Text>
        <Text style={[styles.bloodPressureValueText, styles.notes]}>{item.notes}</Text>
      </View>
      <Text style={styles.bloodPressureDate}>{item.dateInfo}</Text>
    </View>
  )

  const renderRightActions = () => {
    const heightStyles = {
      paddingBottom: isShowingNotes ? 0 : 16,
      paddingTop: isShowingNotes ? 16 : 0
    }
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={[styles.rightActionButton, heightStyles]}>
          <MaterialCommunityIcons name="lead-pencil" size={32} color="#0b6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item)} style={[styles.rightActionButton, heightStyles]}>
          <MaterialCommunityIcons name="trash-can" size={32} color="#e33" />
        </TouchableOpacity>
      </View>
    )
  }

  // TODO: Make the pressable component change opacity when pressing and NOT swiping
  return (
    <Pressable
      style={styles.bloodPressureItem}
      onPress={onPress}
    >
      {renderBloodPressureInfo(isShowingNotes)}
      {isShowingNotes && renderNotes()}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bloodPressureItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 0,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  topView: {
    backgroundColor: "#fff",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  topViewSection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bloodPressureView: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bloodPressureValueView: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  bloodPressureValueLabelText: {
    textAlign: "center",
    color: "#999",
    fontFamily: "Inter-Bold",
    fontSize: 12,
    marginHorizontal: 0,
    marginTop: 0,
  },
  bloodPressureValueText: {
    color: "#333",
    fontFamily: "Inter-SemiBold",
    fontSize: 32,
    margin: 0,
    textAlign: "center",
  },
  bloodPressureSpacer: {
    marginTop: 8,
    marginBottom: 0,
    marginHorizontal: 8,
    color: "#333",
    fontFamily: "Inter-SemiBold",
    fontSize: 32,
  },
  bloodPressureDate: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    color: "#555",
    fontFamily: "Inter-Bold",
    fontSize: 16,
    textAlign: "center",
    margin: 0,
    paddingTop: 8,
  },
  notesIcon: {
    marginBottom: 8,
    paddingRight: 8,
  },
  notes: {
    textAlign: "left",
    fontFamily: "Inter-SemiBold",
    fontSize: 24,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 116,
    paddingLeft: 16,
  },
  rightActionButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "50%",
  },
})

/**
 * Memoized version of `BloodPressureFlatListItem`.
 *
 * Because there can be lots of swiping and pressing on these components,
 * and react context causes everything to re-render by default,
 * this memo function ensures that the component only re-renders when it needs to.
 */
const memoizedBloodPressureFlatListItem = memo(BloodPressureFlatListItem, (prevProps, newProps) => {
  // If the item itself changes, re-render (props are NOT equal, return false)
  if (
    prevProps.item.id !== newProps.item.id
    || prevProps.item.systolic !== newProps.item.systolic
    || prevProps.item.diastolic !== newProps.item.diastolic
    || prevProps.item.date !== newProps.item.date
    || prevProps.item.heartRate !== newProps.item.heartRate
    || prevProps.item.notes !== newProps.item.notes
  ) return false;

  // If the swipedItem changes and it WAS or IS the item id,
  // we want to close the swipe, so we should re-render (props are NOT equal, return false)
  if (
    prevProps.selectedComponentId !== newProps.selectedComponentId &&
    (prevProps.selectedComponentId === newProps.item.id || newProps.selectedComponentId === newProps.item.id)
  ) {
    return false;
  }

  // If any function signatures change, re-render (props are NOT equal, return false)
  if (prevProps.onEdit !== newProps.onEdit || prevProps.onDelete !== newProps.onDelete || prevProps.setSelectedComponentId !== newProps.setSelectedComponentId) {
    return false;
  }

  // Otherwise, don't re-render (props ARE equal, return true)
  return true;
})

export {
  memoizedBloodPressureFlatListItem as BloodPressureFlatListItem
}
