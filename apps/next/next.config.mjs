import fs from 'node:fs'
import path from 'node:path'

const loadRootEnvFile = (filename) => {
  const filePath = path.resolve(process.cwd(), '..', '..', filename)
  if (!fs.existsSync(filePath)) {
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const separator = line.indexOf('=')
    if (separator <= 0) {
      continue
    }

    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadRootEnvFile('.env.local')
loadRootEnvFile('.env')

const publicRestDbBaseUrl =
  process.env.NEXT_PUBLIC_RESTDB_BASE_URL ??
  process.env.VITE_RESTDB_BASE_URL ??
  process.env.RESTDB_BASE_URL ??
  ''
const publicRestDbCollection =
  process.env.NEXT_PUBLIC_RESTDB_COLLECTION ??
  process.env.VITE_RESTDB_COLLECTION ??
  process.env.RESTDB_COLLECTION ??
  ''
const publicRestDbApiKey =
  process.env.NEXT_PUBLIC_RESTDB_API_KEY ??
  process.env.VITE_RESTDB_API_KEY ??
  ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_RESTDB_BASE_URL: publicRestDbBaseUrl,
    NEXT_PUBLIC_RESTDB_COLLECTION: publicRestDbCollection,
    NEXT_PUBLIC_RESTDB_API_KEY: publicRestDbApiKey,
  },
  transpilePackages: [
    '@audio-player/app',
    '@audio-player/config',
    'react-native',
    'react-native-web',
    'solito',
    'tamagui',
  ],
  typedRoutes: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'react-native$': 'react-native-web',
    }
    return config
  },
}

export default nextConfig
