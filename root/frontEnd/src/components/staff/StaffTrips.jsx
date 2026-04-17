import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const StaffTrips = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ route: '', date: '' })

  useEffect(() => {
    fetchTrips()
  }, [search])

  const fetchTrips = async () => {
    try {
      const params = new URLSearchParams()
      if (search.date) params.append('date', search.date)
      if (search.route) params.append('route', search.route)
      
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

  if (loading) return <div className="loading-spinner">Loading schedule...</div>

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Upcoming Trip Schedule</h2>
          <Link to="/request-transport" className="btn btn-primary">
            + Request Transport
          </Link>
        </div>
        
        <div className="filters">
          <input
            type="date"
            value={search.date}
            onChange={(e) => setSearch({ ...search, date: e.target.value })}
            className="form-input"
            placeholder="Filter by date"
          />
          <input
            type="text"
            value={search.route}
            onChange={(e) => setSearch({ ...search, route: e.target.value })}
            className="form-input"
            placeholder="Search by route"
          />
          <button 
            className="btn btn-outline" 
            onClick={() => setSearch({ route: '', date: '' })}
          >
            Clear
          </button>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.trip_id}>
                <td>{trip.trip_date}</td>
                <td>{trip.trip_time}</td>
                <td>{trip.route}</td>
                <td>{trip.driver_name || 'TBA'}</td>
                <td>{trip.registration_number || 'TBA'}</td>
                <td>
                  <span className={`badge ${getStatusClass(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
                <td>
                  {trip.status === 'completed' && (
                    <Link 
                      to={`/feedback/new?tripId=${trip.trip_id}`} 
                      className="btn btn-sm btn-outline"
                    >
                      Rate Trip
                    </Link>
                  )}
                  {trip.status === 'scheduled' && (
                    <span className="badge badge-info">Available</span>
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

export default StaffTrips