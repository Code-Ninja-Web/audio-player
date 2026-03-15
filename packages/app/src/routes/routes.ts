export type AppRoute =
  | {
      name: 'home'
      channelId?: string
    }

export const buildHomeLink = (channelId?: string): string => {
  if (!channelId) {
    return '/'
  }

  const params = new URLSearchParams({ channelId })
  return `/?${params.toString()}`
}
