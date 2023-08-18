import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import Auth from "./screens/Auth";


const queryClient = new QueryClient();

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <PaperProvider>
            <Auth />
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
