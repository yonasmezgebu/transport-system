import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  resetPassword: async (email) => {
    const response = await api.post('/auth/reset-password', { email })
    return response.data
  },

  confirmReset: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password/confirm', { token, newPassword })
    return response.data
  }
}