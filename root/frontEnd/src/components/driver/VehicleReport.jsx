import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const VehicleReport = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [myTrips, setMyTrips] = useState([])
  
  const [formData, setFormData] = useState({
    vehicle_id: '',
    trip_id: '',
    report_type: 'pre_trip',
    issue_type: '',
    description: '',
    urgency: 'medium'
  })

  useEffect(() => {
    fetchVehicles()
    fetchMyTrips()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles')
      setVehicles(response.data)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    }
  }

  const fetchMyTrips = async () => {
    try {
      const response = await api.get('/trips')
      setMyTrips(response.data)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/vehicles/report', formData)
      setSuccess('Vehicle report submitted successfully!')
      setFormData({
        vehicle_id: '',
        trip_id: '',
        report_type: 'pre_trip',
        issue_type: '',
        description: '',
        urgency: 'medium'
      })
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit vehicle report')
    } finally {
      setLoading(false)
    }
  }

  const issueTypes = [
    'Engine Issue',
    'Brake Problem',
    'Tire Damage',
    'Electrical Issue',
    'Lights Not Working',
    'Transmission Problem',
    'Suspension Issue',
    'Air Conditioning',
    'Body Damage',
    'Other'
  ]

  return (
    <div className="card">
      <div className="card-header">
        <h2>Vehicle Condition Report</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="form-group">
            <label className="form-label">Report Type *</label>
            <select
              name="report_type"
              className="form-select"
              value={formData.report_type}
              onChange={handleChange}
              required
            >
              <option value="pre_trip">Pre-Trip Inspection (Before Departure)</option>
              <option value="post_trip">Post-Trip Inspection (After Arrival)</option>
              <option value="issue">Report Issue / Maintenance Need</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Vehicle *</label>
            <select
              name="vehicle_id"
              className="form-select"
              value={formData.vehicle_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                  {vehicle.registration_number} - {vehicle.model}
                </option>
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
              <option value="">Select Trip</option>
              {myTrips.map(trip => (
                <option key={trip.trip_id} value={trip.trip_id}>
                  {trip.trip_date} - {trip.route}
                </option>
              ))}
            </select>
          </div>

          {formData.report_type === 'issue' && (
            <>
              <div className="form-group">
                <label className="form-label">Issue Type *</label>
                <select
                  name="issue_type"
                  className="form-select"
                  value={formData.issue_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Issue Type</option>
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urgency Level *</label>
                <select
                  name="urgency"
                  className="form-select"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                >
                  <option value="low">Low - Can be scheduled later</option>
                  <option value="medium">Medium - Needs attention soon</option>
                  <option value="high">High - Immediate attention required</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group full-width">
            <label className="form-label">
              {formData.report_type === 'pre_trip' && 'Pre-Trip Inspection Notes *'}
              {formData.report_type === 'post_trip' && 'Post-Trip Condition Notes *'}
              {formData.report_type === 'issue' && 'Issue Description *'}
            </label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder={
                formData.report_type === 'pre_trip' 
                  ? 'Check and report: Engine, brakes, lights, tires, fluids, cleanliness...'
                  : formData.report_type === 'post_trip'
                  ? 'Report any issues noticed during the trip, damage, or maintenance needs...'
                  : 'Describe the issue in detail, including when it started and any unusual sounds/smells...'
              }
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/my-trips')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>

      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>📋 Note:</strong> 
        {formData.report_type === 'pre_trip' && ' Pre-trip inspection is required before starting any trip. Report any issues immediately.'}
        {formData.report_type === 'post_trip' && ' Post-trip inspection helps identify issues that occurred during the trip.'}
        {formData.report_type === 'issue' && ' Urgent issues will be sent immediately to the Fleet Officer.'}
      </div>
    </div>
  )
}

export default VehicleReport