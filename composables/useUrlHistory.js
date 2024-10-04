import { ref } from 'vue'

const STORAGE_KEY = 'search-url'

export const useUrlHistory = () => {
  const storedUrl = ref(null)

  const addURLToStorage = (url) => {
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(url))
      storedUrl.value = url
    }
  }

  const getURLFromStorage = () => {
    if (process.client) {
      const storedValue = localStorage.getItem(STORAGE_KEY)
      storedUrl.value = storedValue ? JSON.parse(storedValue) : null
    }
    return storedUrl.value
  }

  // Initialize storedUrl on client-side
  if (process.client) {
    getURLFromStorage()
  }

  return {
    storedUrl,
    addURLToStorage,
    getURLFromStorage
  }
}