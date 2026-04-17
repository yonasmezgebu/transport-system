import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../services/api'

const StudentFeedback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tripId = searchParams.get('tripId')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [trip, setTrip] = useState(null)
  const [myFeedback, setMyFeedback] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (tripId) {
      fetchTripDetails()
    }
    fetchMyFeedback()
  }, [tripId])

  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/trips/${tripId}`)
      setTrip(response.data)
    } catch (error) {
      console.error('Failed to fetch trip details:', error)
      setError('Trip not found')
    }
  }

  const fetchMyFeedback = async () => {
    try {
      const response = await api.get('/feedback/my')
      setMyFeedback(response.data)
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/feedback', {
        trip_id: tripId,
        rating,
        comment
      })
      setSuccess('Thank you for your feedback!')
      setRating(0)
      setComment('')
      fetchMyFeedback()
      setTimeout(() => {
        navigate('/student-schedule')
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className="star-btn"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: (hoverRating || rating) >= i ? '#ff9800' : '#ddd',
            transition: 'color 0.2s',
            padding: '0 0.25rem'
          }}
        >
          ★
        </button>
      )
    }
    return stars
  }

  const getRatingLabel = (ratingValue) => {
    const labels = {
      1: 'Poor - Very dissatisfied',
      2: 'Fair - Below expectations',
      3: 'Good - Satisfactory',
      4: 'Very Good - Above expectations',
      5: 'Excellent - Highly satisfied'
    }
    return labels[ratingValue] || ''
  }

  if (!tripId) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>My Feedback History</h2>
        </div>
        
        {myFeedback && myFeedback.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Route</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {myFeedback.map((feedback) => (
                <tr key={feedback.feedback_id}>
                  <td>{feedback.trip_date}</td>
                  <td>{feedback.route}</td>
                  <td>
                    <span style={{ color: '#ff9800' }}>
                      {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                    </span>
                  </td>
                  <td>{feedback.comment || '-'}</td>
                  <td>{feedback.submitted_at?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info">
            You haven't submitted any feedback yet. Rate your trips to help improve our service!
          </div>
        )}
        
        <button className="btn btn-primary" onClick={() => navigate('/student-schedule')}>
          Back to Schedule
        </button>
      </div>
    )
  }

  if (error && !trip) {
    return (
      <div className="card">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/student-schedule')}>
          Back to Schedule
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Rate Your Trip</h2>
        <p>Your feedback helps us improve the transport service</p>
      </div>

      {trip && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
          <p><strong>🚍 Route:</strong> {trip.route}</p>
          <p><strong>📅 Date:</strong> {trip.trip_date}</p>
          <p><strong>⏰ Time:</strong> {trip.trip_time}</p>
          <p><strong>👨‍✈️ Driver:</strong> {trip.driver_name || 'N/A'}</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Your Rating *</label>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {renderStars()}
          </div>
          {rating > 0 && (
            <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
              {getRatingLabel(rating)}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Your Comments</label>
          <textarea
            className="form-textarea"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience... Was the bus on time? Was the driver professional? Was the bus clean? Any suggestions?"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/student-schedule')}>
            Skip
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>

      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>⭐ Did you know?</strong> Your ratings help us:
        <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
          <li>Recognize excellent drivers</li>
          <li>Identify areas for improvement</li>
          <li>Maintain service quality standards</li>
        </ul>
      </div>
    </div>
  )
}

export default StudentFeedback