import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

import { FlatListHeader } from "./FlatListHeader"
import { BloodPressureFlatListItem } from "./BloodPressureFlatListItem"
import { BloodPressureRecording } from "../../models/BloodPressureRecording"

interface IBloodPressureFlatListProps {
  bloodPressureRecordings: BloodPressureRecording[],
  paddingBottom?: number
}

const EmptyListComponent = () => {
  return (
    <View style={styles.emptyComponentContainer}>
      <Ionicons name="hourglass-outline" size={64} color="#999"/>
      <Text style={styles.emptyComponentText}>No data to show</Text>
    </View>
  )
}

export const BloodPressureFlatList = ({ bloodPressureRecordings, paddingBottom = 0 }: IBloodPressureFlatListProps) => {

  const headerValues = ["Date/Time", "Blood Pressure", "Heart Rate"]

  const renderItem = useCallback(({item}: {item: BloodPressureRecording}) => <BloodPressureFlatListItem item={item} />, [])

  return (
    <View style={styles.table} >
      <FlatListHeader headerData={headerValues} />
      <FlatList
        style={{paddingBottom: 100}}
        data={bloodPressureRecordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.datetime.toISOString()}
        ListFooterComponent={<View style={{paddingBottom: paddingBottom}} />}
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
