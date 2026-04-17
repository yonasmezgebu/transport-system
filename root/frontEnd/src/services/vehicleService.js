import api from './api'

export const vehicleService = {
  getAllVehicles: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/vehicles${queryParams ? `?${queryParams}` : ''}`)
  },

  getVehicleById: (id) => api.get(`/vehicles/${id}`),

  createVehicle: (data) => api.post('/vehicles', data),

  updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),

  deleteVehicle: (id) => api.delete(`/vehicles/${id}`),

  getVehiclesByStatus: (status) => api.get(`/vehicles?status=${status}`),

  uploadDocument: (vehicleId, formData) => 
    api.post(`/vehicles/${vehicleId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}