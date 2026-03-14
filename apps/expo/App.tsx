import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native'
import { HomeScreen } from '@audio-player/app'
import { createNativePlayerEngine } from './src/native-player-engine'

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1115' }}>
      <StatusBar style="light" />
      <HomeScreen createEngine={createNativePlayerEngine} />
    </SafeAreaView>
  )
}
