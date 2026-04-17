import React, { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    
    if (darkMode) {
      document.body.classList.add('dark-mode')
      document.documentElement.style.setProperty('--background', '#1a1a2e')
      document.documentElement.style.setProperty('--text', '#ffffff')
      document.documentElement.style.setProperty('--white', '#16213e')
      document.documentElement.style.setProperty('--border', '#2c2c3e')
      document.documentElement.style.setProperty('--text-light', '#a0a0b0')
    } else {
      document.body.classList.remove('dark-mode')
      document.documentElement.style.setProperty('--background', '#f9fafb')
      document.documentElement.style.setProperty('--text', '#111827')
      document.documentElement.style.setProperty('--white', '#ffffff')
      document.documentElement.style.setProperty('--border', '#e5e7eb')
      document.documentElement.style.setProperty('--text-light', '#6b7280')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const getTheme = () => ({
    isDark: darkMode,
    toggle: toggleDarkMode,
    colors: darkMode ? {
      primary: '#3b82f6',
      background: '#1a1a2e',
      text: '#ffffff',
      card: '#16213e',
      border: '#2c2c3e'
    } : {
      primary: '#1a56db',
      background: '#f9fafb',
      text: '#111827',
      card: '#ffffff',
      border: '#e5e7eb'
    }
  })

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, getTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}