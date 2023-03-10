import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import GoogleSheet, { batchGet } from './api/google-sheets-component';
import { getClientCredentials } from "./api/getClient"
import { listMajors } from "./api/listMajorsApi"


export default function App() {
  const clientId = '1008404841908-vmbff5pa10bf6dqkvkph1d1c4j650gol.apps.googleusercontent.com';
  const GOOGLE_REDIRECT_URI = 'https://localhost';
  const SPREADSHEET_ID = "1J2Cu5DwMX0aYodwAcaNY-fHoXhNLFmAZo3_-EZiSXmQ"

  const _onPressButton = async () => {
    const clientCreds = await getClientCredentials()
    listMajors(clientCreds)
  }

  return (
    <View style={styles.container}>
      {/* <GoogleSheet
        credentialsDetails={{
          clientId,
          redirectUrl: GOOGLE_REDIRECT_URI
        }}
        spreadsheetId={SPREADSHEET_ID}
      /> */}
      <TouchableOpacity onPress={_onPressButton}>
        <Text>Get Data</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
