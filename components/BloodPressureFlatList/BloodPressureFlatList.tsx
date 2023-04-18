import Ionicons from "@expo/vector-icons/Ionicons"
import { useCallback, useContext, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native"

import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../App";
import { BloodPressureDispatchAction, BloodPressureDispatchActionType } from "../../data/BloodPressureDispatchAction";
import { BloodPressureRecordingContext, BloodPressureRecordingDispatchContext } from "../../data/BloodPressureRecordingProvider";
import { BloodPressureRecording } from "../../models/BloodPressureRecording"
import { BloodPressureFlatListItem } from "./BloodPressureFlatListItem"
import { FlatListHeader } from "./FlatListHeader"

interface IBloodPressureFlatListProps {
  paddingBottom?: number,
  navigation: NavigationProp<AppStackParamList, "MainPage">
}

const EmptyListComponent = () => {
  return (
    <View style={styles.emptyComponentContainer}>
      <Ionicons name="hourglass-outline" size={64} color="#999"/>
      <Text style={styles.emptyComponentText}>No data to show</Text>
    </View>
  )
}

export const BloodPressureFlatList = ({ paddingBottom = 0, navigation }: IBloodPressureFlatListProps) => {
  const bloodPressureRecordings = useContext(BloodPressureRecordingContext)
  const bloodPressureRecordingDispatch = useContext(BloodPressureRecordingDispatchContext)
  const headerValues = ["Date/Time", "Blood Pressure", "Heart Rate"]
  const [swipedComponentId, setSwipedComponentId] = useState("")

  const onEdit = (bloodPressureRecording: BloodPressureRecording) => {
    navigation.navigate("BloodPressureRecordingForm", {bloodPressureRecordingIdToEdit: bloodPressureRecording.id})
  }

  const onDelete = (bloodPressureRecording: BloodPressureRecording) => {
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
  }

  const renderItem = useCallback(({item}: {item: BloodPressureRecording}) => (
    <BloodPressureFlatListItem
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      swipedComponentId={swipedComponentId}
      setSwipedComponentId={setSwipedComponentId}
    />
  ), [bloodPressureRecordings, swipedComponentId])

  return (
    <View style={styles.table} >
      <FlatListHeader headerData={headerValues} />
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
