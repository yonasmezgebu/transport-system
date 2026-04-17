import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const TripForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  
  const [formData, setFormData] = useState({
    trip_date: '',
    trip_time: '',
    route: '',
    purpose: '',
    category: 'regular',
    expected_passenger_count: 0,
    driver_id: '',
    vehicle_id: ''
  })

  useEffect(() => {
    fetchDrivers()
    fetchVehicles()
  }, [])

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/drivers')
      setDrivers(response.data)
    } catch (error) {
      console.error('Failed to fetch drivers:', error)
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles?status=active')
      setVehicles(response.data)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/trips', formData)
      navigate('/trips')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  const routes = [
    'Campus to Injibara Town',
    'Campus to Zengena',
    'Campus to Chagni',
    'Campus to Dangila',
    'Campus to Staff Housing'
  ]

  return (
    <div className="card">
      <div className="card-header">
        <h2>Create New Trip</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="form-group">
            <label className="form-label">Trip Date *</label>
            <input
              type="date"
              name="trip_date"
              className="form-input"
              value={formData.trip_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trip Time *</label>
            <input
              type="time"
              name="trip_time"
              className="form-input"
              value={formData.trip_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Route *</label>
            <select
              name="route"
              className="form-select"
              value={formData.route}
              onChange={handleChange}
              required
            >
              <option value="">Select Route</option>
              {routes.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="regular">Regular</option>
              <option value="special_event">Special Event</option>
              <option value="field_trip">Field Trip</option>
              <option value="weekend_program">Weekend Program</option>
              <option value="evening_class">Evening Class</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Expected Passengers</label>
            <input
              type="number"
              name="expected_passenger_count"
              className="form-input"
              value={formData.expected_passenger_count}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Driver *</label>
            <select
              name="driver_id"
              className="form-select"
              value={formData.driver_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Driver</option>
              {drivers.map(driver => (
                <option key={driver.driver_id} value={driver.driver_id}>
                  {driver.full_name} (License: {driver.license_number})
                </option>
              ))}
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
                  {vehicle.registration_number} - {vehicle.model} ({vehicle.capacity} seats)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Purpose</label>
            <textarea
              name="purpose"
              className="form-textarea"
              rows="3"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Enter trip purpose"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/trips')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TripForm