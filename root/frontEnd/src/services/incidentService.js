import api from './api'

export const incidentService = {
  createIncident: (data) => api.post('/incidents', data),

  submitIncident: (id) => api.put(`/incidents/${id}/submit`),

  getIncidents: () => api.get('/incidents'),

  getIncidentById: (id) => api.get(`/incidents/${id}`),

  getMyIncidents: () => api.get('/incidents/my'),

  uploadPhoto: (id, file) => {
    const formData = new FormData()
    formData.append('photo', file)
    return api.post(`/incidents/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  getIncidentPhotos: (id) => api.get(`/incidents/${id}/photos`),

  getIncidentReport: (startDate, endDate) => 
    api.get('/incidents/report', { params: { start_date: startDate, end_date: endDate } })
}