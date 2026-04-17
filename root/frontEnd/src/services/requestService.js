import api from './api'

export const requestService = {
  submitRequest: (data) => api.post('/requests', data),

  getRequests: () => api.get('/requests'),

  getRequestById: (id) => api.get(`/requests/${id}`),

  approveRequest: (id) => api.put(`/requests/${id}/approve`),

  rejectRequest: (id, reason) => api.put(`/requests/${id}/reject`, { rejection_reason: reason }),

  getMyRequests: () => api.get('/requests/my'),

  getPendingRequests: () => api.get('/requests?status=pending'),

  getRequestsByDepartment: (departmentId) => api.get(`/requests/department/${departmentId}`)
}