import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons"
import Clipboard from '@react-native-community/clipboard';
import base64 from 'react-native-base64';

import { BloodPressureRecordingContext } from '../data/BloodPressureRecordingProvider';
import { BloodPressureRecording } from '../models';
import { BloodPressureFlatListItem } from './BloodPressureFlatListItem';

export const MainPage = () => {
  /**
   * @type {BloodPressureRecording[]?}
   */
  const bloodPressureRecordings = useContext(BloodPressureRecordingContext)
  const navigation = useNavigation();

  const navigateToBloodPressureRecordingForm = () => {
    navigation.navigate('BloodPressureRecordingForm');
  };

  const copyJsonToClipboard = () => {
    const jsonString = JSON.stringify(bloodPressureRecordings)
    const base64String = base64.encode(jsonString)
    Clipboard.setString(base64String)
    Alert.prompt("Data copied to clipboard as base64 string")
  }

  const renderHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.datetime]}>Date/Time</Text>
        <Text style={[styles.headerText, styles.bloodPressure]}>Blood Pressure</Text>
        <Text style={[styles.headerText, styles.heartRate]}>Heart Rate</Text>
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
          keyExtractor={(item) => item.datetime}
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
