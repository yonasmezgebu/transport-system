import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  // ========== NEW FEATURES ==========
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(null)
  const [sessionTimeout, setSessionTimeout] = useState(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [pendingCredentials, setPendingCredentials] = useState(null)
  
  // Session timeout duration (30 minutes)
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000
  const MAX_LOGIN_ATTEMPTS = 5
  const LOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes

  // ========== SESSION TIMEOUT MANAGEMENT ==========
  const startSessionTimer = () => {
    if (sessionTimeout) clearTimeout(sessionTimeout)
    
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        console.log('Session expired due to inactivity')
        logout('Session expired. Please login again.')
      }
    }, SESSION_TIMEOUT_MS)
    
    setSessionTimeout(timer)
  }

  const resetSessionTimer = () => {
    if (isAuthenticated) {
      startSessionTimer()
    }
  }

  // Track user activity
  useEffect(() => {
    if (isAuthenticated) {
      startSessionTimer()
      
      const events = ['mousedown', 'keydown', 'scroll', 'click', 'touchstart']
      events.forEach(event => {
        window.addEventListener(event, resetSessionTimer)
      })
      
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, resetSessionTimer)
        })
        if (sessionTimeout) clearTimeout(sessionTimeout)
      }
    }
  }, [isAuthenticated])

  // ========== LOGIN LOCKOUT MANAGEMENT ==========
  const resetLoginAttempts = () => {
    setLoginAttempts(0)
    setIsLocked(false)
    if (lockTimer) clearTimeout(lockTimer)
    setLockTimer(null)
  }

  const incrementLoginAttempts = () => {
    const newAttempts = loginAttempts + 1
    setLoginAttempts(newAttempts)
    
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      setIsLocked(true)
      const timer = setTimeout(() => {
        resetLoginAttempts()
      }, LOCK_DURATION_MS)
      setLockTimer(timer)
      return true // Account is now locked
    }
    return false // Account not locked yet
  }

  // ========== TOKEN REFRESH ==========
  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh-token')
      const { token: newToken } = response.data
      
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout('Session expired. Please login again.')
      return false
    }
  }

  // ========== PERSIST LOGIN (Remember Me) ==========
  const persistLogin = (shouldRemember) => {
    setRememberMe(shouldRemember)
    if (!shouldRemember) {
      // If not remembering, set session storage only
      sessionStorage.setItem('tempToken', token)
    } else {
      // Clear temp token if exists
      sessionStorage.removeItem('tempToken')
    }
  }

  // ========== TWO-FACTOR AUTHENTICATION ==========
  const initiateTwoFactor = async (email, password) => {
    try {
      const response = await api.post('/auth/2fa/initiate', { email, password })
      if (response.data.requiresTwoFactor) {
        setTwoFactorRequired(true)
        setPendingCredentials({ email, password })
        return { requiresTwoFactor: true, message: '2FA code sent to your email' }
      }
      return { requiresTwoFactor: false }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || '2FA initiation failed' 
      }
    }
  }

  const verifyTwoFactor = async (code) => {
    try {
      const response = await api.post('/auth/2fa/verify', { 
        ...pendingCredentials, 
        code 
      })
      
      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(userData)
      setIsAuthenticated(true)
      setTwoFactorRequired(false)
      setPendingCredentials(null)
      resetLoginAttempts()
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Invalid 2FA code' 
      }
    }
  }

  // ========== UPDATE USER PROFILE ==========
  const updateUserProfile = async (userData) => {
    try {
      const response = await api.put('/users/profile', userData)
      setUser(prev => ({ ...prev, ...response.data.user }))
      return { success: true, user: response.data.user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update profile' 
      }
    }
  }

  // ========== CHANGE PASSWORD ==========
  const changePassword = async (oldPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to change password' 
      }
    }
  }

  // ========== FORGOT PASSWORD ==========
  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email })
      return { success: true, message: 'Reset link sent to your email' }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send reset link' 
      }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      await api.post('/auth/reset-password', { token, newPassword })
      return { success: true, message: 'Password reset successfully' }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to reset password' 
      }
    }
  }

  // ========== LOGIN WITH REMEMBER ME ==========
  const login = async (email, password, remember = false) => {
    // Check if account is locked
    if (isLocked) {
      return { 
        success: false, 
        error: `Too many failed attempts. Please try again after ${LOCK_DURATION_MS / 60000} minutes.`,
        isLocked: true
      }
    }
    
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data
      
      // Store token based on remember me preference
      if (remember) {
        localStorage.setItem('token', newToken)
        localStorage.setItem('rememberMe', 'true')
      } else {
        sessionStorage.setItem('token', newToken)
        localStorage.removeItem('rememberMe')
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(userData)
      setIsAuthenticated(true)
      setRememberMe(remember)
      resetLoginAttempts()
      
      return { success: true }
    } catch (error) {
      const isLockedNow = incrementLoginAttempts()
      
      let errorMessage = error.response?.data?.error || 'Login failed'
      if (isLockedNow) {
        errorMessage = `Account temporarily locked due to multiple failed attempts. Please try again after ${LOCK_DURATION_MS / 60000} minutes.`
      }
      
      return { 
        success: false, 
        error: errorMessage,
        remainingAttempts: MAX_LOGIN_ATTEMPTS - (loginAttempts + 1),
        isLocked: isLockedNow
      }
    }
  }

  // ========== LOGOUT WITH MESSAGE ==========
  const logout = async (message = null) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    // Clear all storage
    localStorage.removeItem('token')
    localStorage.removeItem('rememberMe')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('tempToken')
    
    delete api.defaults.headers.common['Authorization']
    
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    setRememberMe(false)
    resetLoginAttempts()
    
    if (sessionTimeout) clearTimeout(sessionTimeout)
    
    // Optional: Show logout message
    if (message) {
      console.log('Logout message:', message)
    }
  }

  // ========== CHECK IF TOKEN IS EXPIRING SOON ==========
  const isTokenExpiringSoon = () => {
    const currentToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!currentToken) return false
    
    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]))
      const expTime = payload.exp * 1000
      const timeUntilExpiry = expTime - Date.now()
      
      // Return true if token expires in less than 5 minutes
      return timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0
    } catch {
      return false
    }
  }

  // ========== AUTO REFRESH TOKEN ==========
  useEffect(() => {
    if (isAuthenticated && isTokenExpiringSoon()) {
      refreshToken()
    }
  }, [isAuthenticated])

  // ========== RESTORE SESSION ON PAGE LOAD ==========
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    const remembered = localStorage.getItem('rememberMe') === 'true'
    
    if (storedToken) {
      setToken(storedToken)
      setRememberMe(remembered)
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  // ========== ROLE CHECK HELPERS ==========
  const hasRole = (roles) => {
    if (!user) return false
    if (typeof roles === 'string') return user.role_name === roles
    return roles.includes(user.role_name)
  }

  const isAdmin = () => {
    return hasRole(['university_admin', 'transport_manager'])
  }

  const isTransportManager = () => hasRole('transport_manager')
  const isFleetOfficer = () => hasRole('fleet_officer')
  const isDriver = () => hasRole('driver')
  const isStaff = () => hasRole('staff')
  const isStudent = () => hasRole('student')
  const isDepartmentHead = () => hasRole('department_head')
  const isGateGuard = () => hasRole('gate_guard')

  // ========== USER INFO HELPERS ==========
  const getUserName = () => user?.full_name || 'User'
  const getUserEmail = () => user?.email || ''
  const getUserRole = () => user?.role_name || ''
  const getUserId = () => user?.user_id || null
  const getUserInitials = () => {
    if (!user?.full_name) return 'U'
    return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // ========== PERMISSION CHECKS ==========
  const canManageTrips = () => hasRole(['transport_manager'])
  const canManageVehicles = () => hasRole(['fleet_officer', 'transport_manager'])
  const canViewReports = () => hasRole(['transport_manager', 'fleet_officer', 'university_admin'])
  const canSubmitRequests = () => hasRole(['staff', 'department_head'])
  const canProvideFeedback = () => hasRole(['staff', 'student'])

  return (
    <AuthContext.Provider value={{ 
      // Original values
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout,
      hasRole,
      
      // NEW: Session Management
      resetSessionTimer,
      refreshToken,
      isTokenExpiringSoon,
      
      // NEW: Login Security
      loginAttempts,
      isLocked,
      rememberMe,
      persistLogin,
      MAX_LOGIN_ATTEMPTS,
      
      // NEW: Two-Factor Authentication
      twoFactorRequired,
      twoFactorCode,
      setTwoFactorCode,
      initiateTwoFactor,
      verifyTwoFactor,
      
      // NEW: Profile Management
      updateUserProfile,
      changePassword,
      forgotPassword,
      resetPassword,
      
      // NEW: Role Helper Functions
      isAdmin,
      isTransportManager,
      isFleetOfficer,
      isDriver,
      isStaff,
      isStudent,
      isDepartmentHead,
      isGateGuard,
      
      // NEW: User Info Helpers
      getUserName,
      getUserEmail,
      getUserRole,
      getUserId,
      getUserInitials,
      
      // NEW: Permission Helpers
      canManageTrips,
      canManageVehicles,
      canViewReports,
      canSubmitRequests,
      canProvideFeedback
    }}>
      {children}
    </AuthContext.Provider>
  )
}