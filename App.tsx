import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import { BloodPressureRecordingForm } from "./components/BloodPressureRecordingForm/BloodPressureRecordingForm";
import { ImportAndExportPage } from "./components/ImportAndExportPage";
import { MainPage } from "./components/MainPage";
import { BloodPressureRecordingProvider } from "./data/BloodPressureRecordingProvider";

/**
 * Following from here: https://reactnavigation.org/docs/typescript/
 */
export type AppStackParamList = {
  MainPage: undefined,
  BloodPressureRecordingForm: undefined,
  ImportAndExportPage: undefined,
}

export default function App() {
  const Stack = createNativeStackNavigator<AppStackParamList>();

  return (
    <SafeAreaView style={{flex: 1}}>
      <BloodPressureRecordingProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='MainPage'>
            <Stack.Screen name="MainPage" component={MainPage}/>
            <Stack.Screen name="BloodPressureRecordingForm" component={BloodPressureRecordingForm}/>
            <Stack.Screen name="ImportAndExportPage" component={ImportAndExportPage}/>
          </Stack.Navigator>
        </NavigationContainer>
      </BloodPressureRecordingProvider>
    </SafeAreaView>
  )
}