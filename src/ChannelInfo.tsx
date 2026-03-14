import { Spinner } from 'grommet'
import { StatusWarning } from 'grommet-icons'
import { Text } from 'grommet/components/Text'
import React, { useEffect, useState, type ReactElement } from 'react'
import {
    Container,
    MediaArt,
    MediaArtContainer,
    MediaArtWrapper,
    MediaStatusContainer,
} from './ChannelInfo.styles'
import { IChannelInfo } from './util'

interface IChannelInfoProps {
    isLoading: boolean
    hasError: boolean
    isExpanded: boolean
    currentChannel: IChannelInfo
    onClick: (expanded: boolean) => void
}

const ChannelInfo = ({
    isExpanded,
    isLoading,
    hasError,
    currentChannel,
    onClick,
}: IChannelInfoProps): ReactElement => {
    const [expanded, setExpanded] = useState<boolean>(false)

    useEffect(() => {
        setExpanded(isExpanded)
    }, [isExpanded])

    const handleOnClick = () => {
        setExpanded(true)
        onClick(true)
    }

    return (
        <Container expanded={expanded} onClick={handleOnClick}>
            <MediaArtContainer expanded={expanded}>
                <MediaArtWrapper expanded={expanded}>
                    {currentChannel?.imageSrc && (
                        <MediaArt
                            src={currentChannel.imageSrc}
                            alt="Media art"
                        />
                    )}
                    {isLoading && !hasError && (
                        <MediaStatusContainer>
                            <Spinner
                                size={expanded ? 'large' : 'medium'}
                                color="white"
                            />
                        </MediaStatusContainer>
                    )}
                    {hasError && (
                        <MediaStatusContainer>
                            <StatusWarning
                                size={expanded ? 'xlarge' : 'medium'}
                                color="yellow"
                            />
                        </MediaStatusContainer>
                    )}
                </MediaArtWrapper>
            </MediaArtContainer>

            <Text size={expanded ? 'xlarge' : 'small'} textAlign={'start'}>
                {currentChannel?.title}
            </Text>
        </Container>
    )
}

export default ChannelInfo
