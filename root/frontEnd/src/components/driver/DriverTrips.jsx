import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const DriverTrips = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [hours, setHours] = useState({ weekly_hours: 0, max_hours: 48 })

  useEffect(() => {
    fetchTrips()
    fetchHours()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips')
      setTrips(response.data)
    } catch (error) {
      console.error('Failed to fetch trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHours = async () => {
    try {
      const response = await api.get('/drivers/1/hours')
      setHours(response.data)
    } catch (error) {
      console.error('Failed to fetch hours:', error)
    }
  }

  const updateTripStatus = async (tripId, status) => {
    try {
      await api.put(`/trips/${tripId}/status`, { status })
      fetchTrips()
      fetchHours()
    } catch (error) {
      alert('Failed to update status')
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

  if (loading) return <div className="loading-spinner">Loading trips...</div>

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>My Weekly Hours</h2>
        </div>
        <div className="hours-display">
          <div className="hours-used">
            {hours.weekly_hours} / {hours.max_hours} hours used
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(hours.weekly_hours / hours.max_hours) * 100}%` }}
            ></div>
          </div>
          {hours.weekly_hours >= hours.max_hours * 0.8 && (
            <div className="alert alert-warning">
              ⚠️ Warning: You are approaching your weekly hour limit
            </div>
          )}
          {hours.weekly_hours >= hours.max_hours && (
            <div className="alert alert-danger">
              ❌ You have reached your maximum weekly hours. Cannot accept more trips.
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>My Assigned Trips</h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Route</th>
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
                <td>{trip.registration_number || 'Not assigned'}</td>
                <td>
                  <span className={`badge ${getStatusClass(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
                <td>
                  {trip.status === 'scheduled' && (
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => updateTripStatus(trip.trip_id, 'in_progress')}
                    >
                      Start Trip
                    </button>
                  )}
                  {trip.status === 'in_progress' && (
                    <>
                      <button 
                        className="btn btn-sm btn-warning" 
                        onClick={() => updateTripStatus(trip.trip_id, 'delayed')}
                      >
                        Report Delay
                      </button>
                      <button 
                        className="btn btn-sm btn-success" 
                        onClick={() => updateTripStatus(trip.trip_id, 'completed')}
                      >
                        Complete Trip
                      </button>
                    </>
                  )}
                  {trip.status === 'delayed' && (
                    <>
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => updateTripStatus(trip.trip_id, 'in_progress')}
                      >
                        Resume Trip
                      </button>
                      <button 
                        className="btn btn-sm btn-success" 
                        onClick={() => updateTripStatus(trip.trip_id, 'completed')}
                      >
                        Complete Trip
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DriverTrips