import api from './api'

export const tripService = {
  getAllTrips: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/trips${queryParams ? `?${queryParams}` : ''}`)
  },

  getTripById: (id) => api.get(`/trips/${id}`),

  createTrip: (data) => api.post('/trips', data),

  updateTripStatus: (id, status) => api.put(`/trips/${id}/status`, { status }),

  cancelTrip: (id, reason) => api.delete(`/trips/${id}`, { data: { reason } }),

  getTripsByDate: (date) => api.get(`/trips?date=${date}`),

  getTripsByRoute: (route) => api.get(`/trips?route=${route}`),

  getTripsByStatus: (status) => api.get(`/trips?status=${status}`)
}