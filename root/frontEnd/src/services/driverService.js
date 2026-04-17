import api from './api'

export const driverService = {
  getAllDrivers: () => api.get('/drivers'),

  getDriverById: (id) => api.get(`/drivers/${id}`),

  createDriver: (data) => api.post('/drivers', data),

  updateDriver: (id, data) => api.put(`/drivers/${id}`, data),

  deleteDriver: (id) => api.delete(`/drivers/${id}`),

  getDriverHours: (id) => api.get(`/drivers/${id}/hours`),

  getDriverIncidents: (id) => api.get(`/drivers/${id}/incidents`),

  getDriverPerformance: (id) => api.get(`/drivers/${id}/performance`)
}