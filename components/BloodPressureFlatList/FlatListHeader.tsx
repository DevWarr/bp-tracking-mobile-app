import { StyleSheet, Text, View } from "react-native";

interface IFlatListHeaderProps {
  /** List of values to display on the header of a FlatList. */
  headerData: string[]
}

/** Header component for a FlatList. */
export const FlatListHeader = ({ headerData }: IFlatListHeaderProps) => {
  return (
    <View style={styles.tableHeader}>
      {headerData.map((headerText: string, index: number) => (
        <Text key={index} style={styles.headerText}>{headerText}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    padding: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
})
