import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const StudentTrips = () => {
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

  const getOccupancyStatus = () => {
    // Simulate occupancy - in real system this would come from actual passenger counts
    const occupancy = Math.floor(Math.random() * 100)
    if (occupancy < 60) return { text: '🟢 Available', class: 'success' }
    if (occupancy < 85) return { text: '🟡 Limited Seats', class: 'warning' }
    return { text: '🔴 Full', class: 'danger' }
  }

  if (loading) return <div className="loading-spinner">Loading schedule...</div>

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Student Transport Schedule</h2>
          <p>Check bus schedules and occupancy before you travel</p>
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

      <div className="grid">
        {trips.map((trip) => {
          const occupancy = getOccupancyStatus()
          return (
            <div key={trip.trip_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{trip.route}</h3>
                <span className={`badge badge-${occupancy.class}`}>{occupancy.text}</span>
              </div>
              <hr style={{ margin: '0.5rem 0' }} />
              <p><strong>📅 Date:</strong> {trip.trip_date}</p>
              <p><strong>⏰ Time:</strong> {trip.trip_time}</p>
              <p><strong>👨‍✈️ Driver:</strong> {trip.driver_name || 'TBA'}</p>
              <p><strong>🚍 Vehicle:</strong> {trip.registration_number || 'TBA'}</p>
              <p><strong>📊 Status:</strong> <span className={`badge ${getStatusClass(trip.status)}`}>{trip.status}</span></p>
              
              {trip.status === 'completed' && (
                <Link 
                  to={`/student-feedback?tripId=${trip.trip_id}`} 
                  className="btn btn-sm btn-outline"
                  style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}
                >
                  ⭐ Rate This Trip
                </Link>
              )}
            </div>
          )
        })}
        {trips.length === 0 && (
          <div className="card">
            <p style={{ textAlign: 'center' }}>No trips found for your search criteria.</p>
          </div>
        )}
      </div>

      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>💡 Tip:</strong> Check occupancy status before heading to the bus stop.
        🟢 Available = Plenty of seats &nbsp;&nbsp;|&nbsp;&nbsp;
        🟡 Limited = Few seats left &nbsp;&nbsp;|&nbsp;&nbsp;
        🔴 Full = Bus is full
      </div>
    </div>
  )
}

export default StudentTrips