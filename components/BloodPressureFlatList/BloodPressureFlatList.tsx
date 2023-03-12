import { FlatList, StyleSheet, View } from "react-native"
import { FlatListHeader } from "./FlatListHeader"
import { BloodPressureFlatListItem } from "./BloodPressureFlatListItem"
import { BloodPressureRecording } from "../../models/BloodPressureRecording"

interface IBloodPressureFlatListProps {
  bloodPressureRecordings: BloodPressureRecording[]
}

export const BloodPressureFlatList = ({ bloodPressureRecordings }: IBloodPressureFlatListProps) => {

  const headerValues = ["Date/Time", "Blood Pressure", "Heart Rate"]

  return (
    <View style={styles.table} >
      <FlatListHeader 
        headerData={headerValues}
      />
      <FlatList
        data={bloodPressureRecordings}
        renderItem={({item}) => <BloodPressureFlatListItem item={item} />}
        keyExtractor={(item) => item.datetime.toISOString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  table: {
    width: '100%',
    marginBottom: 20,
    maxHeight: "100%",
  }
})