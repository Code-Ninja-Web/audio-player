import type { AppTamaguiConfig } from './tamagui'

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
