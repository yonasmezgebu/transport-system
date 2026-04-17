import api from './api'

export const maintenanceService = {
  recordMaintenance: (data) => api.post('/maintenance/records', data),

  getUpcomingMaintenance: () => api.get('/maintenance/upcoming'),

  getMaintenanceHistory: (vehicleId) => api.get(`/maintenance/history/${vehicleId}`),

  getMaintenanceReport: (startDate, endDate) => 
    api.get('/maintenance/report', { params: { start_date: startDate, end_date: endDate } }),

  scheduleMaintenance: (vehicleId, data) => 
    api.post(`/maintenance/schedule/${vehicleId}`, data),

  getVehicleMaintenanceCost: (vehicleId) => 
    api.get(`/maintenance/cost/${vehicleId}`)
}