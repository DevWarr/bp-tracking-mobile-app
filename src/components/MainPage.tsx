import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

import { AppStackParamList } from '../App';
import { BloodPressureRecordingContext } from "../data/BloodPressureRecordingProvider";
import { BloodPressureFlatList } from './BloodPressureFlatList/BloodPressureFlatList';

export const MainPage = () => {
  const bloodPressureRecordings = useContext(BloodPressureRecordingContext)
  const navigation = useNavigation<NavigationProp<AppStackParamList, "MainPage">>();

  return (
    <View style={styles.container}>

      <BloodPressureFlatList bloodPressureRecordings={bloodPressureRecordings} paddingBottom={120} navigation={navigation}/>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          disabled // Removing until CSV compatibility
          style={[styles.footerButton, styles.copyJsonButton]}
          onPress={() => navigation.navigate('ImportAndExportPage')}
        >
          <Ionicons name="clipboard" color="white" size={28}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.addButton]}
          onPress={() => navigation.navigate('BloodPressureRecordingForm')}
        >
          <Text style={styles.addButtonIcon}>+</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  footerContainer: {
    position: 'absolute',
    paddingHorizontal: "10%",
    width: "100%",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerButton: {
    borderRadius: 30,
    width: 60,
    height: 60,
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  copyJsonButton: {
    backgroundColor: '#0A3',
    opacity: 0, // Removing until CSV compatibility
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  addButtonIcon: {
    fontFamily: "Inter-SemiBold",
    color: "white",
    fontSize: 48,
    margin: 0,
    marginRight: 1,
    padding: 0,
    lineHeight: 52,
    textAlign: "center",
  },
})
