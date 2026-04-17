import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const GateSchedule = () => {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [searchReg, setSearchReg] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchSchedule()
    const interval = setInterval(fetchSchedule, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/gate/schedule/today')
      setSchedule(response.data)
    } catch (error) {
      console.error('Failed to fetch schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const recordEntry = async (tripId) => {
    setActionLoading(true)
    try {
      const response = await api.post(`/gate/entry/${tripId}`)
      console.log('Entry response:', response.data)
      alert(`✅ Entry recorded at ${new Date().toLocaleTimeString()}`)
      fetchSchedule()
    } catch (error) {
      console.error('Entry error:', error.response?.data)
      const errorMsg = error.response?.data?.error || 'Failed to record entry'
      alert(`❌ ${errorMsg}`)
    } finally {
      setActionLoading(false)
    }
  }

  const recordExit = async (tripId) => {
    setActionLoading(true)
    try {
      const response = await api.post(`/gate/exit/${tripId}`)
      console.log('Exit response:', response.data)
      alert(`✅ Exit recorded at ${new Date().toLocaleTimeString()}`)
      fetchSchedule()
    } catch (error) {
      console.error('Exit error:', error.response?.data)
      const errorMsg = error.response?.data?.error || 'Failed to record exit'
      alert(`❌ ${errorMsg}`)
    } finally {
      setActionLoading(false)
    }
  }

  const verifyVehicle = async () => {
    if (!searchReg.trim()) {
      alert('Please enter a vehicle registration number')
      return
    }

    try {
      const response = await api.get(`/gate/verify/${searchReg.toUpperCase()}`)
      setVerificationResult(response.data)
    } catch (error) {
      setVerificationResult({ verified: false, error: error.response?.data?.error || 'Vehicle not found' })
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

  const getStatusText = (status) => {
    const texts = {
      scheduled: 'Scheduled',
      in_progress: 'On Route',
      completed: 'Completed',
      cancelled: 'Cancelled',
      delayed: 'Delayed'
    }
    return texts[status] || status
  }

  // Check if entry/exit can be recorded
  const canRecordEntry = (status) => {
    return status === 'scheduled' || status === 'delayed'
  }

  const canRecordExit = (status) => {
    return status === 'in_progress' || status === 'delayed'
  }

  if (loading) return <div className="loading-spinner">Loading today's schedule...</div>

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>🚪 Gate Guard Dashboard</h2>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Vehicle Verification Section */}
      <div className="card">
        <div className="card-header">
          <h3>🔍 Quick Vehicle Verification</h3>
        </div>
        <div className="filters">
          <input
            type="text"
            value={searchReg}
            onChange={(e) => setSearchReg(e.target.value)}
            className="form-input"
            placeholder="Enter Registration Number (e.g., AA-1234)"
            style={{ maxWidth: '300px' }}
          />
          <button className="btn btn-primary" onClick={verifyVehicle} disabled={actionLoading}>
            Verify Vehicle
          </button>
        </div>

        {verificationResult && (
          <div className={`alert ${verificationResult.verified ? 'alert-success' : 'alert-danger'}`} style={{ marginTop: '1rem' }}>
            {verificationResult.verified ? (
              <div>
                <strong>✅ Vehicle Verified</strong>
                <p><strong>Registration:</strong> {verificationResult.vehicle?.registration_number}</p>
                <p><strong>Route:</strong> {verificationResult.vehicle?.route}</p>
                <p><strong>Departure:</strong> {verificationResult.vehicle?.trip_time}</p>
                <p><strong>Driver:</strong> {verificationResult.vehicle?.driver_name}</p>
              </div>
            ) : (
              <div>
                <strong>❌ Verification Failed</strong>
                <p>{verificationResult.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Today's Schedule Table */}
      <div className="card">
        <div className="card-header">
          <h3>📋 Today's Vehicle Schedule</h3>
          <p>Total Trips: {schedule.length}</p>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Route</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((trip) => (
              <tr key={trip.trip_id} style={{ backgroundColor: selectedTrip === trip.trip_id ? '#e8f4f8' : 'transparent' }}>
                <td><strong>{trip.trip_time}</strong></td>
                <td>{trip.route}</td>
                <td>
                  <strong>{trip.registration_number}</strong><br/>
                  <small style={{ color: '#666' }}>{trip.model}</small>
                </td>
                <td>{trip.driver_name}</td>
                <td>
                  <span className={`badge ${getStatusClass(trip.status)}`}>
                    {getStatusText(trip.status)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => recordEntry(trip.trip_id)}
                      disabled={actionLoading || !canRecordEntry(trip.status)}
                      title={!canRecordEntry(trip.status) ? 'Entry can only be recorded for Scheduled or Delayed trips' : ''}
                    >
                      🚪 Record Entry
                    </button>
                    <button 
                      className="btn btn-sm btn-success" 
                      onClick={() => recordExit(trip.trip_id)}
                      disabled={actionLoading || !canRecordExit(trip.status)}
                      title={!canRecordExit(trip.status) ? 'Exit can only be recorded for In Progress or Delayed trips' : ''}
                    >
                      🚪 Record Exit
                    </button>
                  </div>
                </td>
               </tr>
            ))}
            {schedule.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  No trips scheduled for today
                </td>
              </tr>

            )}
          </tbody>
        </table>
      </div>

      {/* Quick Stats */}
      <div className="grid">
        <div className="card">
          <h3>📊 Today's Statistics</h3>
          <p><strong>Scheduled:</strong> {schedule.filter(t => t.status === 'scheduled').length}</p>
          <p><strong>In Progress:</strong> {schedule.filter(t => t.status === 'in_progress').length}</p>
          <p><strong>Completed:</strong> {schedule.filter(t => t.status === 'completed').length}</p>
          <p><strong>Cancelled:</strong> {schedule.filter(t => t.status === 'cancelled').length}</p>
        </div>

        <div className="card">
          <h3>📌 Gate Guard Instructions</h3>
          <ul style={{ marginLeft: '1rem', lineHeight: '1.8' }}>
            <li>🔹 Verify vehicle registration number before allowing exit</li>
            <li>🔹 Record entry when vehicle leaves campus (only for Scheduled trips)</li>
            <li>🔹 Record exit when vehicle returns to campus (only for In Progress trips)</li>
            <li>🔹 Use Quick Verification to check vehicle authorization</li>
            <li>🔹 Report any unauthorized vehicles immediately</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GateSchedule