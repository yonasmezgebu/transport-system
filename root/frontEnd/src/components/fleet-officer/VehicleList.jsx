import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles')
      setVehicles(response.data)
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    const classes = {
      active: 'badge-success',
      maintenance: 'badge-warning',
      retired: 'badge-danger'
    }
    return classes[status] || 'badge-info'
  }

  const updateStatus = async (id, status) => {
    const vehicle = vehicles.find(v => v.vehicle_id === id)
    if (vehicle) {
      try {
        await api.put(`/vehicles/${id}`, { ...vehicle, status })
        fetchVehicles()
      } catch (error) {
        alert('Failed to update vehicle status')
      }
    }
  }

  if (loading) return <div className="loading-spinner">Loading vehicles...</div>

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Vehicle Fleet Management</h2>
          <Link to="/vehicles/new" className="btn btn-primary">+ Add New Vehicle</Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Registration</th>
              <th>Model</th>
              <th>Capacity</th>
              <th>Fuel Type</th>
              <th>Status</th>
              <th>Mileage (km)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.vehicle_id}>
                <td>{vehicle.registration_number}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.fuel_type}</td>
                <td>
                  <span className={`badge ${getStatusClass(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td>{vehicle.current_mileage.toLocaleString()}</td>
                <td>
                  <select
                    className="form-select"
                    value={vehicle.status}
                    onChange={(e) => updateStatus(vehicle.vehicle_id, e.target.value)}
                    style={{ width: '120px' }}
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </td>
               </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No vehicles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VehicleList