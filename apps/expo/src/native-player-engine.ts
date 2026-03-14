import TrackPlayer, {
  Capability,
  Event,
  State,
  type PlaybackState,
} from 'react-native-track-player'
import type { AudioPlayerEngine, PlayerState } from '@audio-player/app'

let isReady = false

const ensureSetup = async () => {
  if (isReady) {
    return
  }

  await TrackPlayer.setupPlayer()
  await TrackPlayer.updateOptions({
    capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
    compactCapabilities: [Capability.Play, Capability.Pause],
    progressUpdateEventInterval: 2,
  })
  isReady = true
}

export const createNativePlayerEngine = (): AudioPlayerEngine => {
  let state: PlayerState = { isLoading: false, hasError: false, isPlaying: false }
  const listeners = new Set<(next: PlayerState) => void>()
  let playbackSubscription: { remove: () => void } | null = null

  const emit = (patch: Partial<PlayerState>) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener(state))
  }

  const attachPlaybackStateListener = () => {
    if (playbackSubscription) {
      return
    }

    playbackSubscription = TrackPlayer.addEventListener(
      Event.PlaybackState,
      (event: PlaybackState) => {
        const nextState = event.state
        emit({
          isLoading: nextState === State.Loading || nextState === State.Buffering,
          isPlaying: nextState === State.Playing,
          hasError: false,
        })
      },
    )
  }

  return {
    async load(src, autoPlay) {
      emit({ isLoading: true, hasError: false })
      try {
        await ensureSetup()
        attachPlaybackStateListener()
        await TrackPlayer.reset()
        await TrackPlayer.add({
          id: src,
          url: src,
          title: 'Live Radio',
          artist: 'Audio Player',
        })
        emit({ isLoading: false, hasError: false })

        if (autoPlay) {
          await TrackPlayer.play()
          emit({ isPlaying: true })
        }
      } catch {
        emit({ isLoading: false, hasError: true, isPlaying: false })
      }
    },
    async play() {
      await ensureSetup()
      await TrackPlayer.play()
      emit({ isPlaying: true })
    },
    async pause() {
      await ensureSetup()
      await TrackPlayer.pause()
      emit({ isPlaying: false })
    },
    async setVolume(volume) {
      await ensureSetup()
      await TrackPlayer.setVolume(volume)
    },
    subscribeToState(listener) {
      listeners.add(listener)
      listener(state)
      return () => listeners.delete(listener)
    },
  }
}
