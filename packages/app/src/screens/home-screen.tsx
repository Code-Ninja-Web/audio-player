'use client'

import tamaguiConfig from '@audio-player/config/tamagui'
import { useMemo } from 'react'
import {
  Button,
  Image,
  ScrollView,
  Spinner,
  TamaguiProvider,
  Text,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { AppContextProvider, useAppContext } from '../context/app-context'
import type { ChannelInfo } from '../domain/channel'
import type { AudioPlayerEngine } from '../player/player-engine'
import { areEqual } from '../utils/are-equal'

const HomeBody = () => {
  const {
    channels,
    favouriteChannels,
    currentChannel,
    isPlaying,
    playerState,
    updateCurrentChannel,
    togglePlayBack,
    nextChannel,
    prevChannel,
    toggleFavouriteChannel,
  } = useAppContext()

  const channelSections = useMemo(
    () => [
      { key: 'favourites', title: 'Your favourite stations', items: favouriteChannels },
      { key: 'live', title: 'On-air stations', items: channels },
    ],
    [channels, favouriteChannels],
  )

  if (!channels.length) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner color="$accentColor" size="large" />
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background" paddingHorizontal="$5" paddingTop="$6" gap="$3">
      <Text color="$color" fontSize="$6" fontWeight="700">
        Audio Player
      </Text>

      <YStack gap="$4">
        {channelSections.map((section) =>
          section.items.length ? (
            <YStack key={section.key} gap="$2">
              <Text color="$mutedColor" fontSize="$4" fontWeight="600">
                {section.title}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$3" paddingRight="$2">
                  {section.items.map((item) => (
                    <ChannelCard
                      key={`${section.key}-${item.id}`}
                      channel={item}
                      active={areEqual(item.id, currentChannel?.id)}
                      onPress={() => void updateCurrentChannel(item.id, true)}
                    />
                  ))}
                </XStack>
              </ScrollView>
            </YStack>
          ) : null,
        )}
      </YStack>

      <YStack
        marginTop="auto"
        marginBottom="$5"
        padding="$5"
        borderRadius="$3"
        backgroundColor="$cardBackground"
        borderWidth={1}
        borderColor="$borderColor"
        gap="$2"
      >
        <Text color="$color" fontSize="$5" fontWeight="700">
          {currentChannel?.title ?? 'Pick a station'}
        </Text>
        <Text color="$mutedColor" fontSize="$3">
          {playerState.hasError
            ? 'Stream unavailable'
            : playerState.isLoading
              ? 'Buffering...'
              : isPlaying
                ? 'Now playing'
                : 'Paused'}
        </Text>
        <XStack gap="$2">
          <ControlButton label="Prev" onPress={() => void prevChannel()} />
          <ControlButton label={isPlaying ? 'Pause' : 'Play'} onPress={() => void togglePlayBack()} />
          <ControlButton label="Next" onPress={() => void nextChannel()} />
        </XStack>
        {currentChannel ? (
          <ControlButton
            label={favouriteChannels.some((c) => areEqual(c.id, currentChannel.id)) ? 'Unfavourite' : 'Favourite'}
            onPress={() => toggleFavouriteChannel(currentChannel)}
          />
        ) : null}
      </YStack>
    </YStack>
  )
}

const ChannelCard = ({
  channel,
  active,
  onPress,
}: {
  channel: ChannelInfo
  active: boolean
  onPress: () => void
}) => (
  <Button
    chromeless
    onPress={onPress}
    padding="$2"
    width={140}
    height={170}
    backgroundColor="$cardBackground"
    borderRadius="$2"
    borderWidth={1}
    borderColor={active ? '$accentColor' : '$borderColor'}
    alignItems="flex-start"
    justifyContent="flex-start"
    gap="$2"
  >
    <Image
      source={{ uri: channel.imageSrc }}
      width={124}
      height={110}
      borderRadius={8}
      resizeMode="cover"
      backgroundColor="#101722"
    />
    <Text color="$color" fontSize="$2" fontWeight="600" numberOfLines={2}>
      {channel.title}
    </Text>
  </Button>
)

const ControlButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Button
    onPress={onPress}
    backgroundColor="#24314a"
    color="$color"
    borderRadius={999}
    paddingHorizontal="$3"
    paddingVertical="$2"
    fontWeight="600"
  >
    {label}
  </Button>
)

export const HomeScreen = ({ createEngine }: { createEngine?: () => AudioPlayerEngine }) => (
  <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
    <Theme name="dark">
      <AppContextProvider createEngine={createEngine}>
        <HomeBody />
      </AppContextProvider>
    </Theme>
  </TamaguiProvider>
)
