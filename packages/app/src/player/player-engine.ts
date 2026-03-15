import Hls from 'hls.js'

export type PlayerState = {
  isLoading: boolean
  hasError: boolean
  isPlaying: boolean
}

export interface AudioPlayerEngine {
  load(src: string, autoPlay?: boolean): Promise<void>
  play(): Promise<void>
  pause(): Promise<void>
  setVolume(volume: number): Promise<void>
  subscribeToState(listener: (state: PlayerState) => void): () => void
}

export const createWebEngine = (): AudioPlayerEngine => {
  const audio = new Audio()
  let hls: Hls | undefined
  let state: PlayerState = { isLoading: false, hasError: false, isPlaying: false }
  const listeners = new Set<(state: PlayerState) => void>()

  const emit = (patch: Partial<PlayerState>) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener(state))
  }

  audio.addEventListener('play', () => emit({ isPlaying: true }))
  audio.addEventListener('pause', () => emit({ isPlaying: false }))
  audio.addEventListener('waiting', () => emit({ isLoading: true }))
  audio.addEventListener('playing', () => emit({ isLoading: false, hasError: false }))
  audio.addEventListener('error', () => emit({ hasError: true, isLoading: false }))

  return {
    async load(src, autoPlay) {
      emit({ isLoading: true, hasError: false })

      if (hls) {
        hls.destroy()
        hls = undefined
      }

      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true })
        hls.attachMedia(audio)
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls?.loadSource(src)
        })
        hls.on(Hls.Events.ERROR, () => {
          emit({ hasError: true, isLoading: false })
        })
      } else {
        audio.src = src
      }

      if (autoPlay) {
        await audio.play().catch(() => undefined)
      }
    },
    async play() {
      await audio.play().catch(() => undefined)
    },
    async pause() {
      audio.pause()
    },
    async setVolume(volume) {
      audio.volume = volume
    },
    subscribeToState(listener) {
      listeners.add(listener)
      listener(state)
      return () => listeners.delete(listener)
    },
  }
}

export const createNativePlaceholderEngine = (): AudioPlayerEngine => {
  let state: PlayerState = { isLoading: false, hasError: false, isPlaying: false }
  const listeners = new Set<(state: PlayerState) => void>()

  const emit = (patch: Partial<PlayerState>) => {
    state = { ...state, ...patch }
    listeners.forEach((listener) => listener(state))
  }

  return {
    async load() {
      emit({ hasError: true, isLoading: false })
    },
    async play() {
      emit({ isPlaying: false, hasError: true })
    },
    async pause() {
      emit({ isPlaying: false })
    },
    async setVolume() {},
    subscribeToState(listener) {
      listeners.add(listener)
      listener(state)
      return () => listeners.delete(listener)
    },
  }
}

export const createDefaultPlayerEngine = (): AudioPlayerEngine =>
  typeof document !== 'undefined' ? createWebEngine() : createNativePlaceholderEngine()
