export const env = {
  restDbBaseUrl:
    process.env.NEXT_PUBLIC_RESTDB_BASE_URL ??
    process.env.EXPO_PUBLIC_RESTDB_BASE_URL ??
    process.env.VITE_RESTDB_BASE_URL,
  restDbCollection:
    process.env.NEXT_PUBLIC_RESTDB_COLLECTION ??
    process.env.EXPO_PUBLIC_RESTDB_COLLECTION ??
    process.env.VITE_RESTDB_COLLECTION,
  restDbApiKey:
    process.env.NEXT_PUBLIC_RESTDB_API_KEY ??
    process.env.EXPO_PUBLIC_RESTDB_API_KEY ??
    process.env.VITE_RESTDB_API_KEY,
}

export const getRequiredEnv = (name: keyof typeof env): string => {
  const value = env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}
