import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const RequestForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    purpose: '',
    requested_date: '',
    requested_time: '',
    passenger_count: 1,
    destination: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/requests', formData)
      setSuccess('Transport request submitted successfully!')
      setFormData({
        purpose: '',
        requested_date: '',
        requested_time: '',
        passenger_count: 1,
        destination: ''
      })
      setTimeout(() => {
        navigate('/schedule')
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  const destinations = [
    'Injibara Town',
    'Zengena',
    'Chagni',
    'Dangila',
    'Bahir Dar',
    'Addis Ababa',
    'Other'
  ]

  return (
    <div className="card">
      <div className="card-header">
        <h2>Request Department Transport</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="form-group">
            <label className="form-label">Purpose *</label>
            <input
              type="text"
              name="purpose"
              className="form-input"
              value={formData.purpose}
              onChange={handleChange}
              required
              placeholder="e.g., Field trip, Conference, Official meeting"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Destination *</label>
            <select
              name="destination"
              className="form-select"
              value={formData.destination}
              onChange={handleChange}
              required
            >
              <option value="">Select Destination</option>
              {destinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Requested Date *</label>
            <input
              type="date"
              name="requested_date"
              className="form-input"
              value={formData.requested_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requested Time *</label>
            <input
              type="time"
              name="requested_time"
              className="form-input"
              value={formData.requested_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Passengers *</label>
            <input
              type="number"
              name="passenger_count"
              className="form-input"
              value={formData.passenger_count}
              onChange={handleChange}
              required
              min="1"
              max="50"
            />
          </div>
        </div>

        <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
          <strong>📋 Note:</strong> Your request will be reviewed by the Transport Manager.
          You will receive a notification when it is approved or rejected.
          Please submit requests at least 2 days in advance.
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/schedule')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RequestForm