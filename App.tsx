import "@ethersproject/shims"
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import Auth from "./screens/Auth";
import MVerify from "./screens/mnemonic/Verify";
import MDisplay from "./screens/mnemonic/Display";
import Wallet from "./screens/Wallet";
import Payment from "./screens/Payment";
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {NetworkProvider} from "./context/network";
import {AccountProvider} from "./context/account";


const queryClient = new QueryClient();
const Stack = createStackNavigator()

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <PaperProvider>
              <AccountProvider>
                <NetworkProvider>
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
                              <Stack.Screen name="Payment" component={Payment} />
                          </Stack.Navigator>
                      </NavigationContainer>
                   </NetworkProvider>
                </AccountProvider>
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
