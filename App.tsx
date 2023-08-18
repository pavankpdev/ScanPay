import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import Auth from "./screens/Auth";
import MVerify from "./screens/mnemonic/Verify";
import MDisplay from "./screens/mnemonic/Display";
import Wallet from "./screens/Wallet";
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
const queryClient = new QueryClient();
const Stack = createStackNavigator()

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <PaperProvider>
              <NavigationContainer>
                  <Stack.Navigator
                      initialRouteName="Auth"
                      screenOptions={{
                          headerShown: false,
                      }}
                  >
                      <Stack.Screen name="Auth" component={Auth} />
                      <Stack.Screen name="DisplayMnemonic" component={MDisplay} />
                      <Stack.Screen name="VerifyMnemonic" component={MVerify} />
                      <Stack.Screen name="Wallet" component={Wallet} />
                  </Stack.Navigator>
              </NavigationContainer>
          </PaperProvider>
      </QueryClientProvider>
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
