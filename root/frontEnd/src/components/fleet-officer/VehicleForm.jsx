import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const VehicleForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    registration_number: '',
    model: '',
    capacity: '',
    fuel_type: 'diesel',
    status: 'active',
    current_mileage: 0,
    purchase_date: ''
  })

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
      await api.post('/vehicles', formData)
      navigate('/vehicles')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Add New Vehicle</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="form-group">
            <label className="form-label">Registration Number *</label>
            <input
              type="text"
              name="registration_number"
              className="form-input"
              value={formData.registration_number}
              onChange={handleChange}
              required
              placeholder="e.g., AA-1234"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Model *</label>
            <input
              type="text"
              name="model"
              className="form-input"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="e.g., Toyota Coaster"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Capacity (seats) *</label>
            <input
              type="number"
              name="capacity"
              className="form-input"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              max="60"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fuel Type</label>
            <select
              name="fuel_type"
              className="form-select"
              value={formData.fuel_type}
              onChange={handleChange}
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Current Mileage (km)</label>
            <input
              type="number"
              name="current_mileage"
              className="form-input"
              value={formData.current_mileage}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              className="form-input"
              value={formData.purchase_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/vehicles')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VehicleForm