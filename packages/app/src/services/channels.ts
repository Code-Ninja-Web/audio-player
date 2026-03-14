import type { ChannelInfo } from '../domain/channel'
import { getRequiredEnv } from '../config/env'

const logFetchError = (error: unknown) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn('[audio-player] Channel fetch failed', error)
  }
}

const getChannelsUrl = (): string => {
  const base = getRequiredEnv('restDbBaseUrl')
  const collection = getRequiredEnv('restDbCollection')
  if (!base || !collection) {
    return ''
  }
  return `${base}/${collection}`
}

export const fetchChannels = async (): Promise<ChannelInfo[]> => {
  try {
    const apiKey = getRequiredEnv('restDbApiKey')
    const url = getChannelsUrl()
    if (!apiKey || !url) {
      return []
    }
    const response = await fetch(url, {
      headers: {
        'x-apikey': apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.status}`)
    }

    return (await response.json()) as ChannelInfo[]
  } catch (error) {
    logFetchError(error)
    return []
  }
}
