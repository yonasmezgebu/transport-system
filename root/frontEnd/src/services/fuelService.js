import api from './api'

export const fuelService = {
  recordFuelPurchase: (data) => api.post('/fuel/logs', data),

  getFuelLogs: (vehicleId) => api.get(`/fuel/logs/vehicle/${vehicleId}`),

  getFuelReport: (startDate, endDate) => 
    api.get('/fuel/report', { params: { start_date: startDate, end_date: endDate } }),

  getVehicleFuelEfficiency: (vehicleId) => api.get(`/fuel/efficiency/${vehicleId}`),

  getFuelSummary: (startDate, endDate) => 
    api.get('/fuel/summary', { params: { start_date: startDate, end_date: endDate } })
}