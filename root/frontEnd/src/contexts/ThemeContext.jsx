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
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark-mode') // keep for backwards compatibility if any old css relies on it
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const getTheme = () => ({
    isDark: darkMode,
    toggle: toggleDarkMode
  })

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, getTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}