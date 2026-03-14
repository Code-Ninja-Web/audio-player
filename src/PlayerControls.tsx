import { Button } from 'grommet'
import React, { Fragment, type ReactElement } from 'react'
import styled from 'styled-components'
import { useAppContext } from './AppStateContext'

import { PlayFill, PauseFill, Next, Previous } from 'grommet-icons'
import { IconButton } from './ChannelInfo.styles'

const Container = styled.div<{ expanded: boolean }>`
    display: flex;
    align-items: center;
    gap: ${(props) => (props.expanded ? '30px' : 0)};
`

const PlayerControls = ({ expanded }: { expanded: boolean }): ReactElement => {
    const {
        currentChannel,
        isPlaying,
        togglePlayBack,
        nextChannel,
        prevChannel,
    } = useAppContext()
    if (!currentChannel) {
        return <Fragment />
    }

    return (
        <Container expanded={expanded}>
            <Button icon={<Previous />} onClick={() => prevChannel()} />

            <IconButton
                icon={isPlaying ? <PauseFill /> : <PlayFill />}
                onClick={() => togglePlayBack()}
                plain={false}
                size={expanded ? 'large' : undefined}
            />

            <Button icon={<Next />} onClick={() => nextChannel()} />
        </Container>
    )
}

export default PlayerControls
