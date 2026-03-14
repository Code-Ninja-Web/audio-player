import React, { Fragment } from 'react'
import styled from 'styled-components'
import { useAppContext } from './AppStateContext'
import { IChannelInfo } from './util'
const OuterWrapper = styled.div``

const Header = styled.div`
    margin: 12px 20px;
`

const InnerWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 18px;
    padding: 10px;
    max-width: 800px;
`
const ItemWrapper = styled.div.attrs<{ $image: string }>(({ $image }) => ({
    style: {
        backgroundImage: `url(${$image})`,
    },
}))<{ $image: string }>`
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    display: flex;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 160px;
    height: 160px;
    border: 0.2px solid white;
    background-color: white;
    filter: drop-shadow(0 0 0.15rem white);

    :hover {
        opacity: 0.8;
        cursor: pointer;
    }
`

const ChannelDetails = (props: IChannelInfo) => {
    const { updateCurrentChannel } = useAppContext()
    return (
        <ItemWrapper
            $image={props.imageSrc}
            onClick={() => {
                updateCurrentChannel(props.id)
            }}
        >
            {/* <span>{props.title}</span> */}
        </ItemWrapper>
    )
}

const ChannelsList = (): React.JSX.Element => {
    const { channels, favouriteChannels } = useAppContext()

    return (
        <OuterWrapper>
            {favouriteChannels && favouriteChannels.length && (
                <Fragment>
                    <Header>Your favourite Stations</Header>
                    <InnerWrapper>
                        {favouriteChannels.map((item) => (
                            <ChannelDetails key={item.id} {...item} />
                        ))}
                    </InnerWrapper>
                </Fragment>
            )}

            <Header>On-Air Stations</Header>
            <InnerWrapper>
                {channels.map((item) => (
                    <ChannelDetails key={item.id} {...item} />
                ))}
            </InnerWrapper>
        </OuterWrapper>
    )
}

export default ChannelsList
