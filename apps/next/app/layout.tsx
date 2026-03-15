import './globals.css'
import '@tamagui/core/reset.css'
import type { Metadata } from 'next'
import { PWARegister } from './pwa-register'

export const metadata: Metadata = {
  title: 'Audio Player',
  description: 'Cross-platform internet radio player',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/icons/favicon-x16.png',
    apple: '/assets/icons/icon-x192.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  )
}
