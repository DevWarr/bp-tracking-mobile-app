import Ionicons from "@expo/vector-icons/Ionicons"
import { useCallback, useContext, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native"

import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../App";
import { BloodPressureDispatchAction, BloodPressureDispatchActionType } from "../../data/BloodPressureDispatchAction";
import { BloodPressureRecordingDispatchContext } from "../../data/BloodPressureRecordingProvider";
import { BloodPressureRecording } from "../../models/BloodPressureRecording"
import { BloodPressureFlatListItem } from "./BloodPressureFlatListItem"

interface IBloodPressureFlatListProps {
  bloodPressureRecordings: BloodPressureRecording[];
  paddingBottom?: number;
  navigation?: NavigationProp<AppStackParamList, "MainPage">;
  isSwipeDisabled?: boolean;
}

/** React component to display when no items are found for the FlatList. */
const EmptyListComponent = () => {
  return (
    <View style={styles.emptyComponentContainer}>
      <Ionicons name="hourglass-outline" size={64} color="#999"/>
      <Text style={styles.emptyComponentText}>No data to show</Text>
    </View>
  )
}

/** React Component that loads all BP Recordings from context and displays them in a FlatList. */
export const BloodPressureFlatList = (
  { bloodPressureRecordings, paddingBottom = 0, navigation, isSwipeDisabled }: IBloodPressureFlatListProps
) => {
  const bloodPressureRecordingDispatch = useContext(BloodPressureRecordingDispatchContext)
  const [selectedComponentId, setSelectedComponentId] = useState("")
  console.log({selectedComponentId})

  /**
   * Reaction to pressing the edit button on a single flat list item.
   *
   * This function navigates to the BloodPressureRecordingForm with the ID of the recording that should be edited.
   *
   * This is within a useCallback() to prevent the function from being re-created on re-render.
   */
  const onEdit = useCallback((bloodPressureRecording: BloodPressureRecording) => {
    if (isSwipeDisabled) return;
    navigation.navigate("BloodPressureRecordingForm", {bloodPressureRecordingIdToEdit: bloodPressureRecording.id})
  }, [])

  /**
   * Reaction to pressing the delete button on a single flat list item.
   *
   * This function uses an alert to verify the user wants to delete the BP recording,
   * and then dispatches the call to delete the item from react context.
   *
   * This is within a useCallback() to prevent the function from being re-created on re-render.
   */
  const onDelete = useCallback((bloodPressureRecording: BloodPressureRecording) => {
    if (isSwipeDisabled) return;
    // TODO: Could this be done within the list item, instead of as an Alert?
    Alert.alert("Delete recording", "Are you sure you want to delete?", [
      {
        text: "Yes",
        onPress: () => {
          const action = new BloodPressureDispatchAction(
            BloodPressureDispatchActionType.DELETED,
            bloodPressureRecording
          )
          bloodPressureRecordingDispatch(action)
        }
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ], {cancelable: true})
  }, [])

  /** Function that renders a singular item in the flat list. */
  const renderItem = useCallback(({item}: {item: BloodPressureRecording}) => (
    <BloodPressureFlatListItem
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      selectedComponentId={selectedComponentId}
      setSelectedComponentId={setSelectedComponentId}
      isSwipeDisabled={!!isSwipeDisabled}
    />
  ), [bloodPressureRecordings, selectedComponentId, isSwipeDisabled])

  return (
    <View style={styles.table} >
      <FlatList
        style={{paddingBottom: 100}}
        data={bloodPressureRecordings}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.dateInfo}${item.id}`}
        ListFooterComponent={<View style={{paddingBottom}} />}
        ListEmptyComponent={<EmptyListComponent />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  table: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    maxHeight: "100%",
  },
  emptyComponentContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
  },
  emptyComponentText: {
    fontSize: 16,
  },
})
