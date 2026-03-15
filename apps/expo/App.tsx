import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { HomeScreen } from '@audio-player/app'
import { createNativePlayerEngine } from './src/native-player-engine'

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1115' }}>
        <StatusBar style="light" />
        <HomeScreen createEngine={createNativePlayerEngine} />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
