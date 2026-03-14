import { createContext, useContext } from 'react'
import type { IChannelInfo } from './util'

export type AppContextParams = {
    channels: IChannelInfo[]
    favouriteChannels: IChannelInfo[] | undefined
    currentChannel: IChannelInfo | null
    isPlaying: boolean
    updateCurrentChannel: (channelId: string) => void
    togglePlayBack: () => void
    nextChannel: () => void
    prevChannel: () => void
    toggleFavouriteChannel: (info: IChannelInfo) => void
}

export const AppContext = createContext<AppContextParams>({
    channels: [],
    favouriteChannels: undefined,
    currentChannel: null,
    isPlaying: false,
    updateCurrentChannel: () => {},
    togglePlayBack: () => {},
    nextChannel: () => {},
    prevChannel: () => {},
    toggleFavouriteChannel: () => {},
})

export const useAppContext = (): AppContextParams => useContext(AppContext)
