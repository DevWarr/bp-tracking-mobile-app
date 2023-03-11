import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BloodPressureRecordingForm } from "./components/BloodPressureRecordingForm";
import { MainPage } from "./components/MainPage";
import { BloodPressureRecordingProvider } from "./data/BloodPressureRecordingProvider";

/**
 * Following from here: https://reactnavigation.org/docs/typescript/
 */
export type AppStackParamList = {
  MainPage: undefined,
  BloodPressureRecordingForm: undefined
}

export default function App() {
  const Stack = createNativeStackNavigator<AppStackParamList>();

  return (
    <BloodPressureRecordingProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='MainPage'>
          <Stack.Screen name="MainPage" component={MainPage}/>
          <Stack.Screen name="BloodPressureRecordingForm" component={BloodPressureRecordingForm}/>
        </Stack.Navigator>
      </NavigationContainer>
    </BloodPressureRecordingProvider>
  )
}