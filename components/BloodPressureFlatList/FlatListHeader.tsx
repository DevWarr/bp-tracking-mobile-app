import { StyleSheet, Text, View } from "react-native";

interface IFlatListHeaderProps {
  headerData: string[]
}

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