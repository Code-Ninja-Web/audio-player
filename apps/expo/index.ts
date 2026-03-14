import { registerRootComponent } from 'expo'
import TrackPlayer from 'react-native-track-player'
import App from './App'
import { playbackService } from './playback-service'

TrackPlayer.registerPlaybackService(() => playbackService)
registerRootComponent(App)
