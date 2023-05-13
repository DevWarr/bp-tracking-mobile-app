import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BloodPressureRecordingFormPage, IBloodPressureRecordingFormRouteParams } from "./components/BloodPressureRecordingFormPage";
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

/** Entry point of Application. */
const App = () => {
  const Stack = createNativeStackNavigator<AppStackParamList>();
  const [isLoaded] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Thin": require("../assets/fonts/Inter-Thin.ttf"),
  })

  if (!isLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{flex: 1}}>
        <BloodPressureRecordingProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='MainPage'>
              <Stack.Screen name="MainPage" component={MainPage} options={{title: "Main Page"}}/>
              <Stack.Screen name="BloodPressureRecordingForm" component={BloodPressureRecordingFormPage} options={{title: "Blood Pressure Recording Form"}}/>
              <Stack.Screen name="ImportAndExportPage" component={ImportAndExportPage} options={{title: "Import and Export Page"}}/>
            </Stack.Navigator>
          </NavigationContainer>
        </BloodPressureRecordingProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

// This allows Expo to understand where the root of the app begins
//     when the file is inside a different folder.
export default registerRootComponent(App)
