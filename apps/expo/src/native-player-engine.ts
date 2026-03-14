import TrackPlayer, {
  Capability,
  Event,
  State,
  TrackType,
  type PlaybackErrorEvent,
  type PlaybackState,
} from 'react-native-track-player'
import type { AudioPlayerEngine, PlayerState } from '@audio-player/app'

let isReady = false

type TrackConfig = {
  contentType?: string
  type?: TrackType
}

const debugLog = (...args: unknown[]) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn(...args)
  }
}

const ensureSetup = async () => {
  if (isReady) {
    return
  }

  await TrackPlayer.setupPlayer()
  await TrackPlayer.updateOptions({
    capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
    notificationCapabilities: [Capability.Play, Capability.Pause],
    progressUpdateEventInterval: 2,
  })
  isReady = true
}

const inferTrackConfig = (src: string): TrackConfig => {
  const normalized = src.toLowerCase()

  if (normalized.includes('.m3u8')) {
    return { type: TrackType.HLS, contentType: 'application/x-mpegurl' }
  }

  if (normalized.includes('.mpd')) {
    return { type: TrackType.Dash, contentType: 'application/dash+xml' }
  }

  if (normalized.includes('.aac')) {
    return { contentType: 'audio/aac' }
  }

  if (normalized.includes('.mp3')) {
    return { contentType: 'audio/mpeg' }
  }

  return { type: TrackType.Default }
}

const alternateTrackConfig = (config: TrackConfig): TrackConfig | null => {
  if (config.type === TrackType.HLS) {
    return { type: TrackType.Default }
  }

  if (config.type === TrackType.Default || !config.type) {
    return { type: TrackType.HLS, contentType: 'application/x-mpegurl' }
  }

  return null
}

export const createNativePlayerEngine = (): AudioPlayerEngine => {
  let state: PlayerState = { isLoading: false, hasError: false, isPlaying: false }
  const listeners = new Set<(next: PlayerState) => void>()
  let playbackSubscription: { remove: () => void } | null = null
  let playbackErrorSubscription: { remove: () => void } | null = null
  let lastLoadedSrc: string | null = null
  let lastAutoPlay = false
  let lastTrackConfig: TrackConfig | null = null
  let didRetryParsingFallback = false

  const emit = (patch: Partial<PlayerState>) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener(state))
  }

  const queueTrack = async (src: string, autoPlay: boolean, config: TrackConfig) => {
    lastLoadedSrc = src
    lastAutoPlay = autoPlay
    lastTrackConfig = config

    await TrackPlayer.reset()
    await TrackPlayer.add({
      id: src,
      url: src,
      title: 'Live Radio',
      artist: 'Audio Player',
      ...config,
    })

    emit({ isLoading: false, hasError: false })

    if (autoPlay) {
      await TrackPlayer.play()
      emit({ isPlaying: true })
    }
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
          hasError: nextState === State.Error ? true : state.hasError,
        })
      },
    )
  }

  const attachPlaybackErrorListener = () => {
    if (playbackErrorSubscription) {
      return
    }

    playbackErrorSubscription = TrackPlayer.addEventListener(
      Event.PlaybackError,
      async (event: PlaybackErrorEvent) => {
        debugLog('[audio-player] Native playback error', event)

        if (
          event.code === 'android-parsing-container-unsupported' &&
          lastLoadedSrc &&
          lastTrackConfig &&
          !didRetryParsingFallback
        ) {
          const nextConfig = alternateTrackConfig(lastTrackConfig)
          if (nextConfig) {
            didRetryParsingFallback = true
            emit({ isLoading: true, hasError: false, isPlaying: false })
            try {
              await queueTrack(lastLoadedSrc, Boolean(lastAutoPlay), nextConfig)
              return
            } catch (retryError) {
              debugLog('[audio-player] Native playback retry failed', retryError)
            }
          }
        }

        emit({ isLoading: false, hasError: true, isPlaying: false })
      },
    )
  }

  return {
    async load(src, autoPlay) {
      emit({ isLoading: true, hasError: false })
      try {
        await ensureSetup()
        attachPlaybackStateListener()
        attachPlaybackErrorListener()
        didRetryParsingFallback = false
        await queueTrack(src, Boolean(autoPlay), inferTrackConfig(src))
      } catch {
        emit({ isLoading: false, hasError: true, isPlaying: false })
      }
    },
    async play() {
      await ensureSetup()
      attachPlaybackStateListener()
      attachPlaybackErrorListener()
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
