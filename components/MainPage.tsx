import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons"
import { setStringAsync as setStringToClipboardAsync } from 'expo-clipboard';

import { BloodPressureRecordingContext } from '../data/BloodPressureRecordingProvider';
import { BloodPressureFlatListItem } from './BloodPressureFlatListItem';
import { AppStackParamList } from '../App';

export const MainPage = () => {
  const bloodPressureRecordings = useContext(BloodPressureRecordingContext)
  const navigation = useNavigation<NavigationProp<AppStackParamList, "MainPage">>();

  const navigateToBloodPressureRecordingForm = () => {
    navigation.navigate('BloodPressureRecordingForm');
  };

  const copyJsonToClipboard = async () => {
    const jsonObjects = bloodPressureRecordings.map((it) => it.buildJsonObject())
    const jsonString = JSON.stringify(jsonObjects)
    await setStringToClipboardAsync(jsonString)
    Alert.prompt("Data copied to clipboard as base64 string")
  }

  const renderHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Date/Time</Text>
        <Text style={styles.headerText}>Blood Pressure</Text>
        <Text style={styles.headerText}>Heart Rate</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {renderHeader()}
        <FlatList
          data={bloodPressureRecordings}
          renderItem={({item}) => <BloodPressureFlatListItem item={item} />}
          keyExtractor={(item) => item.datetime.toISOString()}
        />
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity style={[styles.footerButton, styles.copyJsonButton]} onPress={copyJsonToClipboard}>
          <Ionicons name="clipboard" color="white" size={28}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton, styles.addButton]} onPress={navigateToBloodPressureRecordingForm}>
          <Ionicons name="add" color="white" size={32}/>
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
  table: {
    width: '100%',
    marginBottom: 20,
  },
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
  addButton: {
    backgroundColor: '#007AFF',
  },
  copyJsonButton: {
    backgroundColor: '#0A3',
  }
})
