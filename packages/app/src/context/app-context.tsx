import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import type { ChannelInfo } from '../domain/channel'
import { fetchChannels } from '../services/channels'
import { storage } from '../storage/storage'
import { areEqual } from '../utils/are-equal'
import {
  createDefaultPlayerEngine,
  type AudioPlayerEngine,
  type PlayerState,
} from '../player/player-engine'

type AppContextValue = {
  isInitialized: boolean
  channels: ChannelInfo[]
  favouriteChannels: ChannelInfo[]
  currentChannel: ChannelInfo | null
  isPlaying: boolean
  playerState: PlayerState
  updateCurrentChannel: (channelId: string, autoPlay?: boolean) => Promise<void>
  togglePlayBack: () => Promise<void>
  nextChannel: () => Promise<void>
  prevChannel: () => Promise<void>
  toggleFavouriteChannel: (channel: ChannelInfo) => void
}

const STORAGE_KEY_FAVOURITE_CHANNELS = 'favouriteChannels'
const STORAGE_KEY_CURRENT_CHANNEL = 'currentChannel'

const AppContext = createContext<AppContextValue | null>(null)

export const AppContextProvider = ({
  children,
  createEngine = createDefaultPlayerEngine,
}: PropsWithChildren<{ createEngine?: () => AudioPlayerEngine }>) => {
  const [channels, setChannels] = useState<ChannelInfo[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [favouriteChannels, setFavouriteChannels] = useState<ChannelInfo[]>([])
  const [currentChannel, setCurrentChannel] = useState<ChannelInfo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerState, setPlayerState] = useState<PlayerState>({
    isLoading: false,
    hasError: false,
    isPlaying: false,
  })
  const engineRef = useRef<AudioPlayerEngine | null>(null)
  if (!engineRef.current) {
    engineRef.current = createEngine()
  }

  useEffect(() => {
    const unsubscribe = engineRef.current?.subscribeToState((state) => {
      setPlayerState(state)
      setIsPlaying(state.isPlaying)
    })

    return unsubscribe ?? (() => {})
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchChannels()
        setChannels(data)

        const savedFavourites = await storage.getItem(STORAGE_KEY_FAVOURITE_CHANNELS)
        if (savedFavourites) {
          setFavouriteChannels(JSON.parse(savedFavourites) as ChannelInfo[])
        }

        const savedCurrent = await storage.getItem(STORAGE_KEY_CURRENT_CHANNEL)
        if (savedCurrent) {
          const parsedCurrent = JSON.parse(savedCurrent) as ChannelInfo
          const hydratedCurrent =
            data.find((channel) => areEqual(channel.id, parsedCurrent.id)) ?? parsedCurrent

          setCurrentChannel(hydratedCurrent)
          await engineRef.current?.load(hydratedCurrent.audioSrc, false)
        }
      } finally {
        setIsInitialized(true)
      }
    }

    void init()
  }, [])

  useEffect(() => {
    if (currentChannel) {
      void storage.setItem(STORAGE_KEY_CURRENT_CHANNEL, JSON.stringify(currentChannel))
    }
  }, [currentChannel])

  useEffect(() => {
    void storage.setItem(STORAGE_KEY_FAVOURITE_CHANNELS, JSON.stringify(favouriteChannels))
  }, [favouriteChannels])

  const updateCurrentChannel = useCallback(
    async (channelId: string, autoPlay = true) => {
      const selected = channels.find((channel) => areEqual(channel.id, channelId))
      if (!selected) {
        return
      }

      setCurrentChannel(selected)
      await engineRef.current?.load(selected.audioSrc, autoPlay)
    },
    [channels],
  )

  const togglePlayBack = useCallback(async () => {
    if (isPlaying) {
      await engineRef.current?.pause()
      return
    }

    await engineRef.current?.play()
  }, [isPlaying])

  const rotateChannel = useCallback(
    async (delta: 1 | -1) => {
      if (!channels.length) {
        return
      }

      const currentIndex = channels.findIndex((channel) =>
        areEqual(channel.id, currentChannel?.id ?? null),
      )
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + delta + channels.length) % channels.length
      const next = channels[nextIndex]
      setCurrentChannel(next)
      await engineRef.current?.load(next.audioSrc, true)
    },
    [channels, currentChannel],
  )

  const nextChannel = useCallback(async () => rotateChannel(1), [rotateChannel])
  const prevChannel = useCallback(async () => rotateChannel(-1), [rotateChannel])

  const toggleFavouriteChannel = useCallback((channel: ChannelInfo) => {
    setFavouriteChannels((current) => {
      const alreadyAdded = current.some((item) => areEqual(item.id, channel.id))
      if (alreadyAdded) {
        return current.filter((item) => !areEqual(item.id, channel.id))
      }
      return [...current, channel]
    })
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      channels,
      isInitialized,
      favouriteChannels,
      currentChannel,
      isPlaying,
      playerState,
      updateCurrentChannel,
      togglePlayBack,
      nextChannel,
      prevChannel,
      toggleFavouriteChannel,
    }),
    [
      channels,
      isInitialized,
      favouriteChannels,
      currentChannel,
      isPlaying,
      playerState,
      updateCurrentChannel,
      togglePlayBack,
      nextChannel,
      prevChannel,
      toggleFavouriteChannel,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used inside AppContextProvider')
  }

  return context
}
