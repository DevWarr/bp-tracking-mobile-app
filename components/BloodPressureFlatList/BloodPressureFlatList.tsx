import { useCallback, useContext } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

import { FlatListHeader } from "./FlatListHeader"
import { BloodPressureFlatListItem } from "./BloodPressureFlatListItem"
import { BloodPressureRecording } from "../../models/BloodPressureRecording"
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../App";
import { BloodPressureRecordingContext, BloodPressureRecordingDispatchContext } from "../../data/BloodPressureRecordingProvider";
import { BloodPressureDispatchAction, BloodPressureDispatchActionType } from "../../data/BloodPressureDispatchAction";

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

  const onEdit = (bloodPressureRecording: BloodPressureRecording) => {
    navigation.navigate("BloodPressureRecordingForm", {bloodPressureRecordingIdToEdit: bloodPressureRecording.id})
  }

  const onDelete = (bloodPressureRecording: BloodPressureRecording) => {
    const action = new BloodPressureDispatchAction(
      BloodPressureDispatchActionType.DELETED,
      bloodPressureRecording
    )
    bloodPressureRecordingDispatch(action)
  }

  const renderItem = useCallback(({item}: {item: BloodPressureRecording}) => (
    <BloodPressureFlatListItem item={item} onEdit={onEdit} onDelete={onDelete}/>
  ), [bloodPressureRecordings])

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
