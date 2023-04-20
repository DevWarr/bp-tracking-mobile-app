import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BloodPressureRecordingForm, IBloodPressureRecordingFormRouteParams } from "./components/BloodPressureRecordingForm";
import { ImportAndExportPage } from "./components/ImportAndExportPage";
import { MainPage } from "./components/MainPage";
import { BloodPressureRecordingProvider } from "./data/BloodPressureRecordingProvider";

/**
 * Following from here: https://reactnavigation.org/docs/typescript/
 */
export type AppStackParamList = {
  MainPage: undefined,
  BloodPressureRecordingForm: IBloodPressureRecordingFormRouteParams | undefined,
  ImportAndExportPage: undefined,
}

export default function App() {
  const Stack = createNativeStackNavigator<AppStackParamList>();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{flex: 1}}>
        <BloodPressureRecordingProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='MainPage'>
              <Stack.Screen name="MainPage" component={MainPage} options={{title: "Main Page"}}/>
              <Stack.Screen name="BloodPressureRecordingForm" component={BloodPressureRecordingForm} options={{title: "Blood Pressure Recording Form"}}/>
              <Stack.Screen name="ImportAndExportPage" component={ImportAndExportPage} options={{title: "Import and Export Page"}}/>
            </Stack.Navigator>
          </NavigationContainer>
        </BloodPressureRecordingProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
