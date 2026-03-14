'use client'

import tamaguiConfig from '@audio-player/config/tamagui'
import { useMemo } from 'react'
import {
  ActivityIndicator,
  Image as NativeImage,
  Pressable,
  ScrollView as NativeScrollView,
  StyleSheet,
} from 'react-native'
import {
  TamaguiProvider,
  Text,
  Theme,
  View,
} from '@tamagui/core'
import { AppContextProvider, useAppContext } from '../context/app-context'
import type { ChannelInfo } from '../domain/channel'
import type { AudioPlayerEngine } from '../player/player-engine'
import { areEqual } from '../utils/are-equal'

const HomeBody = () => {
  const {
    isInitialized,
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
    if (isInitialized) {
      return (
        <View flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$5" gap="$2">
          <Text color="$color" fontSize="$5" fontWeight="700">
            No channels available
          </Text>
          <Text color="$mutedColor" textAlign="center">
            Set EXPO_PUBLIC_RESTDB_* (mobile) or NEXT_PUBLIC_RESTDB_* (web) and restart the app.
          </Text>
        </View>
      )
    }

    return (
      <View flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <ActivityIndicator color="#4bb3fd" size="large" />
      </View>
    )
  }

  return (
    <View flex={1} backgroundColor="$background" paddingHorizontal="$5" paddingTop="$6" gap="$3">
      <Text color="$color" fontSize="$6" fontWeight="700">
        Audio Player
      </Text>

      <View gap="$4">
        {channelSections.map((section) =>
          section.items.length ? (
            <View key={section.key} gap="$2">
              <Text color="$mutedColor" fontSize="$4" fontWeight="600">
                {section.title}
              </Text>
              <NativeScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View flexDirection="row" gap="$3" paddingRight="$2">
                  {section.items.map((item) => (
                    <ChannelCard
                      key={`${section.key}-${item.id}`}
                      channel={item}
                      active={areEqual(item.id, currentChannel?.id)}
                      onPress={() => void updateCurrentChannel(item.id, true)}
                    />
                  ))}
                </View>
              </NativeScrollView>
            </View>
          ) : null,
        )}
      </View>

      <View
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
        <View flexDirection="row" gap="$2">
          <ControlButton label="Prev" onPress={() => void prevChannel()} />
          <ControlButton label={isPlaying ? 'Pause' : 'Play'} onPress={() => void togglePlayBack()} />
          <ControlButton label="Next" onPress={() => void nextChannel()} />
        </View>
        {currentChannel ? (
          <ControlButton
            label={favouriteChannels.some((c) => areEqual(c.id, currentChannel.id)) ? 'Unfavourite' : 'Favourite'}
            onPress={() => toggleFavouriteChannel(currentChannel)}
          />
        ) : null}
      </View>
    </View>
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
  <Pressable onPress={onPress} style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}>
    <View
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
      <NativeImage source={{ uri: channel.imageSrc }} style={styles.channelImage} resizeMode="cover" />
      <Text color="$color" fontSize="$2" fontWeight="600" numberOfLines={2}>
        {channel.title}
      </Text>
    </View>
  </Pressable>
)

const ControlButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}>
    <View backgroundColor="#24314a" borderRadius={999} paddingHorizontal="$3" paddingVertical="$2">
      <Text color="$color" fontWeight="600">
        {label}
      </Text>
    </View>
  </Pressable>
)

export const HomeScreen = ({ createEngine }: { createEngine?: () => AudioPlayerEngine }) => (
  <TamaguiProvider config={tamaguiConfig as any} defaultTheme="dark">
    <Theme name="dark">
      <AppContextProvider createEngine={createEngine}>
        <HomeBody />
      </AppContextProvider>
    </Theme>
  </TamaguiProvider>
)

const styles = StyleSheet.create({
  cardPressable: {
    borderRadius: 12,
  },
  cardPressed: {
    opacity: 0.85,
  },
  channelImage: {
    width: 124,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#101722',
  },
  controlButton: {
    borderRadius: 999,
  },
  controlButtonPressed: {
    opacity: 0.9,
  },
  scrollContent: {
    paddingRight: 8,
  },
})
