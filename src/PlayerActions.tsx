import PlayerControls from './PlayerControls'
import { Favorite, Share } from 'grommet-icons'
import { IconButton } from './ChannelInfo.styles'
import React, { useEffect, useState, type ReactElement } from 'react'
import { useAppContext } from './AppStateContext'
import { areEqual, IChannelInfo } from './util'
import styled from 'styled-components'
import { Box } from 'grommet'

const Container = styled(Box)`
    flex-direction: row;
    align-items: center;
    gap: 20px;
`

const PlayerActions = ({
    currentChannel,
    expanded,
}: {
    currentChannel: IChannelInfo
    expanded: boolean
}): ReactElement => {
    const [isFavourite, setIsFavourite] = useState<boolean>(false)

    const { favouriteChannels, toggleFavouriteChannel } = useAppContext()

    useEffect(() => {
        if (!currentChannel?.id || !favouriteChannels) {
            return
        }
        const favouriteChannel = favouriteChannels.find((channel) =>
            areEqual(channel.id, currentChannel.id)
        )
        if (favouriteChannel && favouriteChannel.id) {
            setIsFavourite(true)
            return
        }
        setIsFavourite(false)
    }, [favouriteChannels, currentChannel])

    const handleToggleFavourite = () => {
        toggleFavouriteChannel(currentChannel)
    }

    const onHandleShare = async () => {
        if (!currentChannel || !currentChannel.id) {
            return
        }

        if (navigator.share) {
            const params = new URLSearchParams()
            params.set('channelId', currentChannel.id)

            try {
                await navigator.share({
                    title: currentChannel.title,
                    text: 'Check out this online radio channel',
                    url: `${window.location.href.replace(
                        window.location.search,
                        ''
                    )}?${params.toString()}`,
                })
            } catch (error) {
                console.log(`Unable to share ${error}`)
            }
        }
    }
    return (
        <Container>
            {expanded && (
                <IconButton
                    icon={<Favorite />}
                    primary={isFavourite}
                    onClick={handleToggleFavourite}
                />
            )}
            <PlayerControls expanded={expanded} />
            {expanded && (
                <IconButton icon={<Share />} onClick={onHandleShare} />
            )}
        </Container>
    )
}

export default PlayerActions
