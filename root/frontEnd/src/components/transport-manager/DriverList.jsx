import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const DriverList = () => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/drivers')
      setDrivers(response.data)
    } catch (error) {
      console.error('Failed to fetch drivers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this driver?')) {
      try {
        await api.delete(`/drivers/${id}`)
        fetchDrivers()
      } catch (error) {
        alert('Failed to deactivate driver')
      }
    }
  }

  if (loading) return <div className="loading-spinner">Loading drivers...</div>

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Drivers Management</h2>
          <Link to="/drivers/new" className="btn btn-primary">+ Add New Driver</Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License Number</th>
              <th>License Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.driver_id}>
                <td>{driver.full_name}</td>
                <td>{driver.email}</td>
                <td>{driver.phone}</td>
                <td>{driver.license_number}</td>
                <td>{driver.license_expiry}</td>
                <td>
                  <span className={`badge ${new Date(driver.license_expiry) < new Date() ? 'badge-danger' : 'badge-success'}`}>
                    {new Date(driver.license_expiry) < new Date() ? 'Expired' : 'Valid'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(driver.driver_id)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No drivers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DriverList