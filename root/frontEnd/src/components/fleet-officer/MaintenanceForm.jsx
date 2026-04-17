import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const MaintenanceForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [upcoming, setUpcoming] = useState([])
  
  const [formData, setFormData] = useState({
    vehicle_id: '',
    type: '',
    maintenance_date: new Date().toISOString().split('T')[0],
    cost_etb: '',
    mileage: '',
    description: '',
    next_due_date: '',
    next_due_mileage: ''
  })

  useEffect(() => {
    fetchVehicles()
    fetchUpcomingMaintenance()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles')
      setVehicles(response.data)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    }
  }

  const fetchUpcomingMaintenance = async () => {
    try {
      const response = await api.get('/maintenance/upcoming')
      setUpcoming(response.data)
    } catch (error) {
      console.error('Failed to fetch upcoming maintenance:', error)
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
      await api.post('/maintenance/records', formData)
      setSuccess('Maintenance recorded successfully!')
      setFormData({
        vehicle_id: '',
        type: '',
        maintenance_date: new Date().toISOString().split('T')[0],
        cost_etb: '',
        mileage: '',
        description: '',
        next_due_date: '',
        next_due_mileage: ''
      })
      fetchUpcomingMaintenance()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to record maintenance')
    } finally {
      setLoading(false)
    }
  }

  const maintenanceTypes = [
    'Oil Change',
    'Tire Replacement',
    'Engine Repair',
    'Brake Service',
    'General Service',
    'Transmission Service',
    'Battery Replacement',
    'Cooling System',
    'Electrical Repair'
  ]

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Record Maintenance</h2>
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
              <label className="form-label">Maintenance Type *</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                {maintenanceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Maintenance Date *</label>
              <input
                type="date"
                name="maintenance_date"
                className="form-input"
                value={formData.maintenance_date}
                onChange={handleChange}
                required
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
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mileage at Service (km) *</label>
              <input
                type="number"
                name="mileage"
                className="form-input"
                value={formData.mileage}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Next Due Date</label>
              <input
                type="date"
                name="next_due_date"
                className="form-input"
                value={formData.next_due_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Next Due Mileage (km)</label>
              <input
                type="number"
                name="next_due_mileage"
                className="form-input"
                value={formData.next_due_mileage}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the maintenance performed"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/vehicles')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Recording...' : 'Record Maintenance'}
            </button>
          </div>
        </form>
      </div>

      {upcoming.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Upcoming Maintenance Alerts</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Last Service</th>
                <th>Next Due Date</th>
                <th>Next Due Mileage</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((item) => (
                <tr key={item.maintenance_id}>
                  <td>{item.registration_number}</td>
                  <td>{item.type}</td>
                  <td>{item.maintenance_date}</td>
                  <td>{item.next_due_date || 'Not set'}</td>
                  <td>{item.next_due_mileage?.toLocaleString() || 'Not set'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MaintenanceForm