import { createFont, createTamagui, createTokens } from '@tamagui/core'

const inter = createFont({
  family: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 22,
    6: 28,
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 20,
    4: 24,
    5: 28,
    6: 34,
  },
  weight: {
    4: '400',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    4: 0,
  },
})

const tokens = createTokens({
  color: {
    background: '#0f1115',
    card: '#1a2130',
    text: '#f7f8fa',
    muted: '#9ca4b4',
    accent: '#4bb3fd',
    success: '#64d39a',
    danger: '#f26f6f',
    border: '#2f3a52',
  },
  radius: {
    0: 0,
    1: 8,
    2: 12,
    3: 16,
    true: 12,
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 28,
    7: 36,
    true: 16,
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 28,
    7: 36,
    true: 16,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    true: 1,
  },
})

const tamaguiConfig = createTamagui({
  tokens,
  fonts: {
    body: inter,
    heading: inter,
  },
  themes: {
    dark: {
      background: '#0f1115',
      color: '#f7f8fa',
      borderColor: '#2f3a52',
      cardBackground: '#1a2130',
      mutedColor: '#9ca4b4',
      accentColor: '#4bb3fd',
      successColor: '#64d39a',
      dangerColor: '#f26f6f',
    },
  },
  defaultTheme: 'dark',
})

export type AppTamaguiConfig = typeof tamaguiConfig

export default tamaguiConfig
