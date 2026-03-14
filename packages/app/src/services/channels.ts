import type { ChannelInfo } from '../domain/channel'
import { getRequiredEnv } from '../config/env'

const getChannelsUrl = (): string => {
  const base = getRequiredEnv('restDbBaseUrl')
  const collection = getRequiredEnv('restDbCollection')
  return `${base}/${collection}`
}

export const fetchChannels = async (): Promise<ChannelInfo[]> => {
  try {
    const apiKey = getRequiredEnv('restDbApiKey')
    const response = await fetch(getChannelsUrl(), {
      headers: {
        'x-apikey': apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.status}`)
    }

    return (await response.json()) as ChannelInfo[]
  } catch (error) {
    console.error(error)
    return []
  }
}
