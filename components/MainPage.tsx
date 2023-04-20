import Ionicons from "@expo/vector-icons/Ionicons"
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';

import { AppStackParamList } from '../App';
import { BloodPressureFlatList } from './BloodPressureFlatList/BloodPressureFlatList';

export const MainPage = () => {
  const navigation = useNavigation<NavigationProp<AppStackParamList, "MainPage">>();

  return (
    <View style={styles.container}>

      <BloodPressureFlatList paddingBottom={120} navigation={navigation}/>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.copyJsonButton]}
          onPress={() => navigation.navigate('ImportAndExportPage')}
        >
          <Ionicons name="clipboard" color="white" size={28}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.addButton]}
          onPress={() => navigation.navigate('BloodPressureRecordingForm')}
        >
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
