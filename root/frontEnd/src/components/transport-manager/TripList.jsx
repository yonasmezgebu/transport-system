import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const TripList = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ date: '', status: '' })

  useEffect(() => {
    fetchTrips()
  }, [filter])

  const fetchTrips = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.date) params.append('date', filter.date)
      if (filter.status) params.append('status', filter.status)
      
      const response = await api.get(`/trips?${params}`)
      setTrips(response.data)
    } catch (error) {
      console.error('Failed to fetch trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    const classes = {
      scheduled: 'badge-info',
      in_progress: 'badge-warning',
      completed: 'badge-success',
      cancelled: 'badge-danger',
      delayed: 'badge-warning'
    }
    return classes[status] || 'badge-info'
  }

  const cancelTrip = async (id) => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      try {
        await api.delete(`/trips/${id}`, { data: { reason: 'Cancelled by manager' } })
        fetchTrips()
      } catch (error) {
        alert('Failed to cancel trip')
      }
    }
  }

  if (loading) return <div className="loading-spinner">Loading trips...</div>

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Trips Management</h2>
          <Link to="/trips/new" className="btn btn-primary">+ Create New Trip</Link>
        </div>
        
        <div className="filters">
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            className="form-input"
            placeholder="Filter by date"
          />
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="form-select"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.trip_id}>
                <td>{trip.trip_date}</td>
                <td>{trip.trip_time}</td>
                <td>{trip.route}</td>
                <td>{trip.driver_name || 'Not assigned'}</td>
                <td>{trip.registration_number || 'Not assigned'}</td>
                <td>
                  <span className={`badge ${getStatusClass(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
                <td>
                  {trip.status === 'scheduled' && (
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => cancelTrip(trip.trip_id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No trips found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TripList