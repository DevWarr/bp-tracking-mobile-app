import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { MainPage, BloodPressureRecordingForm } from './components';
import { BloodPressureRecordingProvider } from './data/BloodPressureRecordingProvider';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    
    <BloodPressureRecordingProvider>
      {/* <View>
        <Text>Hello, testing testing</Text>
      </View> */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName='MainPage'>
          <Stack.Screen name="MainPage" component={MainPage}/>
          <Stack.Screen name="BloodPressureRecordingForm" component={BloodPressureRecordingForm}/>
        </Stack.Navigator>
      </NavigationContainer>
    </BloodPressureRecordingProvider>
  );
}
