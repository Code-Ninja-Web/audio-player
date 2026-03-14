import { Box, Image, Text, TextInput } from 'grommet'
import { Search } from 'grommet-icons'
import React, {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type ReactElement,
} from 'react'
import styled from 'styled-components'
import { useAppContext } from './AppStateContext'
import { IChannelInfo } from './util'

const OuterWrapper = styled.div`
    position: sticky;
    top: 0;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #fff;
    background-color: var(--bg-primary-color);
    filter: drop-shadow(0 0 0.2rem black);
`
const InnerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 72px;
    border-bottom: 1px solid grey;
    background-color: rgba(64, 64, 64, 0.8);
    align-items: center;
`

const IconImage = styled.img`
    border-radius: 50%;
    width: 48px;
    ::before {
        content: '';
        width: 48px;
        height: 48px;
        background-color: #ccc;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 24px;
        transform: translateY(-50%);
    }
`

interface ISuggestion {
    label: ReactElement
    value: string
    channel: IChannelInfo
}

interface ISuggestionSelectEvent {
    suggestion: ISuggestion
}

const formatSuggestions = (
    suggestedChannels: IChannelInfo[],
    value = ''
): ISuggestion[] =>
    suggestedChannels
        .filter(
            (suggestedChannel) =>
                suggestedChannel.title
                    .toLowerCase()
                    .indexOf(value.toLowerCase()) >= 0
        )
        .map((suggestedChannel, index, list) => ({
            label: (
                <Box
                    direction="row"
                    align="center"
                    gap="small"
                    border={index < list.length - 1 ? 'bottom' : undefined}
                    pad="small"
                >
                    <Image
                        width="80px"
                        src={suggestedChannel.imageSrc}
                        style={{ borderRadius: '8px' }}
                    />
                    <Text size={'small'}>{suggestedChannel?.title}</Text>
                </Box>
            ),
            value: suggestedChannel.title,
            channel: suggestedChannel,
        }))

const Header = (): ReactElement => {
    const { channels, updateCurrentChannel } = useAppContext()
    const [selectedChannel, setSelectedChannel] = useState<IChannelInfo>()
    const [suggestionOpen, setSuggestionOpen] = useState(false)
    const [suggestions, setSuggestions] = useState<ISuggestion[]>([])
    const [selectedChannelTitle, setSelectedChannelTitle] = useState<string>('')

    useEffect(() => {
        if (selectedChannel && selectedChannel.id) {
            updateCurrentChannel(selectedChannel.id)
        }
    }, [selectedChannel, updateCurrentChannel])

    const onInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { value: newValue } = event.target
            setSelectedChannelTitle(newValue)
            setSelectedChannel(undefined)

            if (!newValue.trim()) {
                setSuggestions([])
            } else {
                setSuggestions(formatSuggestions(channels, newValue))
            }
        },
        [channels]
    )

    const onSuggestionSelect = useCallback((event: ISuggestionSelectEvent) => {
        setSelectedChannel(event.suggestion.channel)
        setSelectedChannelTitle(event.suggestion.value)
    }, [])

    const onSuggestionsOpen = useCallback(() => {
        setSuggestions(formatSuggestions(channels, selectedChannel?.title))
        setSuggestionOpen(true)
    }, [channels, selectedChannel])

    const onSuggestionsClose = useCallback(() => {
        setSuggestions([])
        setSuggestionOpen(false)
        setSelectedChannel(undefined)
        setSelectedChannelTitle('')
    }, [])

    return (
        <OuterWrapper>
            <InnerWrapper>
                <IconImage src={'/assets/icons/icon-x192.png'} alt="Logo" />
                <Box
                    width="medium"
                    gap="medium"
                    direction="row"
                    align="center"
                    elevation={suggestionOpen ? 'medium' : undefined}
                    style={
                        suggestionOpen
                            ? {
                                  borderBottomLeftRadius: '0px',
                                  borderBottomRightRadius: '0px',
                              }
                            : undefined
                    }
                    pad={{ left: 'large' }}
                >
                    <TextInput
                        icon={<Search />}
                        reverse
                        placeholder="search"
                        suggestions={suggestions}
                        value={selectedChannelTitle}
                        onChange={onInputChange}
                        onSuggestionsOpen={onSuggestionsOpen}
                        onSuggestionsClose={onSuggestionsClose}
                        onSuggestionSelect={onSuggestionSelect}
                    />
                </Box>
            </InnerWrapper>
        </OuterWrapper>
    )
}

export default Header
