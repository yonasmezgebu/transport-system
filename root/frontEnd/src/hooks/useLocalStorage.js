import { useState, useEffect, useCallback } from 'react'

const useLocalStorage = (key, initialValue) => {
  // Get stored value
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue)

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') {
      console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`)
      return
    }

    try {
      // Allow value to be a function so we have same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value
      
      // Save to state
      setStoredValue(newValue)
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(newValue))
      
      // Dispatch a custom event so other hooks can react to changes
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Clear all values from localStorage
  const clearAll = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.clear()
      setStoredValue(initialValue)
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      console.warn('Error clearing localStorage:', error)
    }
  }, [initialValue])

  // Listen to changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue))
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue)
      }
    }

    const handleCustomEvent = () => {
      setStoredValue(readValue())
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage', handleCustomEvent)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleCustomEvent)
    }
  }, [key, readValue, initialValue])

  return [storedValue, setValue, removeValue, clearAll]
}

export default useLocalStorage