import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/variables.css'
import './App.css'

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render with strict mode for development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Register service worker for PWA (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration)
    }).catch(error => {
      console.log('SW registration failed:', error)
    })
  })
}

// Log environment
console.log(`App running in ${process.env.NODE_ENV} mode`)
console.log(`API URL: ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`)