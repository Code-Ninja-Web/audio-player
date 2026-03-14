import type { AppTamaguiConfig } from './tamagui'

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
