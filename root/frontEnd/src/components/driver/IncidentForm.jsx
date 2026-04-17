import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const IncidentForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [trips, setTrips] = useState([])
  const [photos, setPhotos] = useState([])
  
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    incident_date: new Date().toISOString().split('T')[0],
    incident_time: '',
    description: '',
    trip_id: '',
    status: 'draft'
  })

  useEffect(() => {
    fetchMyTrips()
  }, [])

  const fetchMyTrips = async () => {
    try {
      const response = await api.get('/trips')
      setTrips(response.data)
    } catch (error) {
      console.error('Failed to fetch trips:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setPhotos([...photos, ...files])
  }

  const removePhoto = (index) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create incident report
      const response = await api.post('/incidents', formData)
      const incidentId = response.data.incident_id

      // Upload photos if any
      if (photos.length > 0 && incidentId) {
        for (const photo of photos) {
          const photoFormData = new FormData()
          photoFormData.append('photo', photo)
          await api.post(`/incidents/${incidentId}/photos`, photoFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
      }

      // Submit the incident if not draft
      if (formData.status === 'submitted') {
        await api.put(`/incidents/${incidentId}/submit`)
      }

      setSuccess('Incident report saved successfully!')
      setTimeout(() => {
        navigate('/my-trips')
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save incident report')
    } finally {
      setLoading(false)
    }
  }

  const incidentTypes = [
    { value: 'traffic', label: '🚗 Traffic Accident' },
    { value: 'road_damage', label: '🛣️ Road Damage' },
    { value: 'mechanical', label: '🔧 Mechanical Issue' },
    { value: 'breakdown', label: '⚠️ Vehicle Breakdown' }
  ]

  return (
    <div className="card">
      <div className="card-header">
        <h2>Report Incident</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="form-group">
            <label className="form-label">Incident Type *</label>
            <select
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Incident Type</option>
              {incidentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Related Trip (Optional)</label>
            <select
              name="trip_id"
              className="form-select"
              value={formData.trip_id}
              onChange={handleChange}
            >
              <option value="">Select Trip (if applicable)</option>
              {trips.map(trip => (
                <option key={trip.trip_id} value={trip.trip_id}>
                  {trip.trip_date} - {trip.route}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Near Zengena Bridge, Main Campus Gate"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Incident Date *</label>
            <input
              type="date"
              name="incident_date"
              className="form-input"
              value={formData.incident_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Incident Time *</label>
            <input
              type="time"
              name="incident_time"
              className="form-input"
              value={formData.incident_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe what happened in detail..."
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Upload Photos (Max 5, 5MB each)</label>
            <input
              type="file"
              className="form-input"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              multiple
            />
            {photos.length > 0 && (
              <div className="photo-list" style={{ marginTop: '0.5rem' }}>
                <p>{photos.length} photo(s) selected:</p>
                {photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <span>{photo.name}</span>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger"
                      onClick={() => removePhoto(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group full-width">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Save as Draft (can edit later)</option>
              <option value="submitted">Submit Final (cannot edit after)</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/my-trips')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : formData.status === 'draft' ? 'Save Draft' : 'Submit Report'}
          </button>
        </div>
      </form>

      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>⚠️ Important:</strong> Incident reports must be submitted within 24 hours of the incident.
        Once submitted, reports cannot be edited.
      </div>
    </div>
  )
}

export default IncidentForm