import api from './api'

export const reportService = {
  getOperationalReport: (startDate, endDate) => 
    api.get('/reports/operational', { params: { start_date: startDate, end_date: endDate } }),

  getFinancialReport: (startDate, endDate) => 
    api.get('/reports/financial', { params: { start_date: startDate, end_date: endDate } }),

  getDriverPerformanceReport: (startDate, endDate) => 
    api.get('/reports/drivers', { params: { start_date: startDate, end_date: endDate } }),

  getFuelReport: (startDate, endDate) => 
    api.get('/reports/fuel', { params: { start_date: startDate, end_date: endDate } }),

  getMaintenanceReport: (startDate, endDate) => 
    api.get('/reports/maintenance', { params: { start_date: startDate, end_date: endDate } }),

  getIncidentReport: (startDate, endDate) => 
    api.get('/reports/incidents', { params: { start_date: startDate, end_date: endDate } }),

  exportToPDF: (reportType, params) => 
    api.get(`/reports/export/pdf/${reportType}`, { params, responseType: 'blob' }),

  exportToExcel: (reportType, params) => 
    api.get(`/reports/export/excel/${reportType}`, { params, responseType: 'blob' })
}