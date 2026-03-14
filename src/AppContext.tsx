import React, {
    useState,
    useEffect,
    useCallback,
    type ReactElement,
    type ReactNode,
} from 'react'
import { AppContext } from './AppStateContext'
import { areEqual, fetchChannels, IChannelInfo } from './util'

export const AppContextProvider = ({
    children,
}: {
    children: ReactNode
}): ReactElement => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    const channelId = params.get('channelId')
    const [currentChannel, setCurrentChannel] = useState<IChannelInfo | null>(
        null
    )
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [channels, setChannels] = useState<IChannelInfo[]>([])
    const [favouriteChannels, setFavouriteChannels] = useState<IChannelInfo[]>()

    const STORAGE_KEY_FAVOURITE_CHANNELS = 'favouriteChannels'
    const STORAGE_KEY_CURRENT_CHANNEL = 'currentChannel'

    useEffect(() => {
        void init()
    }, [])

    const init = async () => {
        setChannels(await fetchChannels())
        const favouriteChannels = localStorage.getItem(
            STORAGE_KEY_FAVOURITE_CHANNELS
        )

        if (favouriteChannels) {
            setFavouriteChannels(JSON.parse(favouriteChannels))
        }
    }

    const updateCurrentChannel = useCallback(
        (channelId: string, autoPlay = true) => {
            const newChannel = channels.find((channel) =>
                areEqual(channel.id, channelId)
            )
            if (newChannel) {
                setCurrentChannel(newChannel)
            }

            if (autoPlay && !isPlaying) {
                setIsPlaying(true)
            }
        },
        [channels, isPlaying]
    )

    const getCurrentChannelIndex = useCallback(
        () =>
            channels.findIndex(
                (channel) =>
                    currentChannel && areEqual(channel.id, currentChannel.id)
            ),
        [channels, currentChannel]
    )

    useEffect(() => {
        if (!channels || !channels.length) {
            return
        }

        if (channelId) {
            updateCurrentChannel(channelId, false)
            return
        }

        const prevSelectedChannel = localStorage.getItem(
            STORAGE_KEY_CURRENT_CHANNEL
        )
        if (prevSelectedChannel) {
            try {
                setCurrentChannel(JSON.parse(prevSelectedChannel))
            } catch (error) {
                console.log({ error })
            }
        }
    }, [channels, channelId, updateCurrentChannel])

    useEffect(() => {
        if (!currentChannel) {
            return
        }
        localStorage.setItem(
            STORAGE_KEY_CURRENT_CHANNEL,
            JSON.stringify(currentChannel)
        )
    }, [currentChannel])

    useEffect(() => {
        if (favouriteChannels) {
            localStorage.setItem(
                STORAGE_KEY_FAVOURITE_CHANNELS,
                JSON.stringify(favouriteChannels)
            )
        }
    }, [favouriteChannels])

    const nextChannel = useCallback(() => {
        const currentChannelIndex = getCurrentChannelIndex()

        if (currentChannelIndex < channels.length - 1) {
            setCurrentChannel(channels[currentChannelIndex + 1])
            return
        }

        setCurrentChannel(channels[0])
    }, [channels, getCurrentChannelIndex])

    const prevChannel = useCallback(() => {
        const currentChannelIndex = getCurrentChannelIndex()

        if (currentChannelIndex >= 1) {
            setCurrentChannel(channels[currentChannelIndex - 1])
            return
        }

        setCurrentChannel(channels[channels.length - 1])
    }, [channels, getCurrentChannelIndex])

    const togglePlayBack = () => {
        setIsPlaying((isPlaying) => !isPlaying)
    }

    const toggleFavouriteChannel = (info: IChannelInfo) => {
        if (favouriteChannels) {
            const favouriteChannel = favouriteChannels.find((channel) =>
                areEqual(channel.id, info.id)
            )

            if (favouriteChannel) {
                // remove from favourite and return
                setFavouriteChannels((currentFavouriteChannels) =>
                    currentFavouriteChannels?.filter(
                        (channel) => !areEqual(channel.id, info.id)
                    )
                )
                return
            }
        }

        setFavouriteChannels((currentFavouriteChannels) => {
            if (!currentFavouriteChannels) {
                currentFavouriteChannels = []
            }

            return [...currentFavouriteChannels, info]
        })
    }

    return (
        <AppContext.Provider
            value={{
                channels,
                favouriteChannels,
                currentChannel,
                isPlaying,
                updateCurrentChannel,
                togglePlayBack,
                nextChannel,
                prevChannel,
                toggleFavouriteChannel,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}
