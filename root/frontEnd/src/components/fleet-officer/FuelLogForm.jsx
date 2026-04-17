import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const FuelLogForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [vehicles, setVehicles] = useState([])
  
  const [formData, setFormData] = useState({
    vehicle_id: '',
    log_date: new Date().toISOString().split('T')[0],
    liters: '',
    cost_etb: '',
    mileage: ''
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

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
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/fuel/logs', formData)
      setSuccess('Fuel purchase recorded successfully!')
      setFormData({
        vehicle_id: '',
        log_date: new Date().toISOString().split('T')[0],
        liters: '',
        cost_etb: '',
        mileage: ''
      })
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to record fuel purchase')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Record Fuel Purchase</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid">
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
            <label className="form-label">Date *</label>
            <input
              type="date"
              name="log_date"
              className="form-input"
              value={formData.log_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Liters *</label>
            <input
              type="number"
              name="liters"
              className="form-input"
              value={formData.liters}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="e.g., 50.00"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cost (ETB) *</label>
            <input
              type="number"
              name="cost_etb"
              className="form-input"
              value={formData.cost_etb}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="e.g., 3500.00"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Mileage (km) *</label>
            <input
              type="number"
              name="mileage"
              className="form-input"
              value={formData.mileage}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g., 10500"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/vehicles')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Recording...' : 'Record Fuel Purchase'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FuelLogForm