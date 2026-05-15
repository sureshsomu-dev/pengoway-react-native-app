import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screens/LoginScreen';
import { JourneyScreen } from './src/screens/JourneyScreen';

export default function App() {
  const [travelerName, setTravelerName] = useState<string | null>(null);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {travelerName ? (
        <JourneyScreen travelerName={travelerName} onSignOut={() => setTravelerName(null)} />
      ) : (
        <LoginScreen onLogin={setTravelerName} />
      )}
    </SafeAreaProvider>
  );
}
