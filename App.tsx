import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import MVerify from "./screens/mnemonic/Verify";


const queryClient = new QueryClient();

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <PaperProvider>
            <MVerify />
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
