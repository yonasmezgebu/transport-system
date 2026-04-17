import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const RequestList = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    fetchRequests()
  }, [filter])

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests')
      let data = response.data
      if (filter) {
        data = data.filter(r => r.status === filter)
      }
      setRequests(data)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await api.put(`/requests/${id}/approve`)
      fetchRequests()
    } catch (error) {
      alert('Failed to approve request')
    }
  }

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:')
    if (reason) {
      try {
        await api.put(`/requests/${id}/reject`, { rejection_reason: reason })
        fetchRequests()
      } catch (error) {
        alert('Failed to reject request')
      }
    }
  }

  const getStatusClass = (status) => {
    const classes = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      scheduled: 'badge-info'
    }
    return classes[status] || 'badge-info'
  }

  if (loading) return <div className="loading-spinner">Loading requests...</div>

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Department Transport Requests</h2>
        </div>

        <div className="filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Requester</th>
              <th>Purpose</th>
              <th>Destination</th>
              <th>Passengers</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.request_id}>
                <td>{req.requested_date}</td>
                <td>{req.requester_name}</td>
                <td>{req.purpose}</td>
                <td>{req.destination}</td>
                <td>{req.passenger_count}</td>
                <td>
                  <span className={`badge ${getStatusClass(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-sm btn-success" 
                        onClick={() => handleApprove(req.request_id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleReject(req.request_id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RequestList