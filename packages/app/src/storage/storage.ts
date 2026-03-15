import AsyncStorage from '@react-native-async-storage/async-storage'

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
}

const hasWebLocalStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const storage: KeyValueStorage = {
  async getItem(key) {
    if (hasWebLocalStorage()) {
      return Promise.resolve(window.localStorage.getItem(key))
    }

    if (!AsyncStorage?.getItem) {
      return null
    }
    return AsyncStorage.getItem(key)
  },
  async setItem(key, value) {
    if (hasWebLocalStorage()) {
      window.localStorage.setItem(key, value)
      return Promise.resolve()
    }

    if (!AsyncStorage?.setItem) {
      return
    }
    await AsyncStorage.setItem(key, value)
  },
}
