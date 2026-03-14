export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
}

const getNativeStorage = async () => {
  const module = await import('@react-native-async-storage/async-storage')
  return module.default
}

export const storage: KeyValueStorage = {
  async getItem(key) {
    if (typeof window !== 'undefined') {
      return Promise.resolve(window.localStorage.getItem(key))
    }

    const nativeStorage = await getNativeStorage()
    return nativeStorage.getItem(key)
  },
  async setItem(key, value) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value)
      return Promise.resolve()
    }

    const nativeStorage = await getNativeStorage()
    await nativeStorage.setItem(key, value)
  },
}
