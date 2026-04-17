import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../services/api'

const FeedbackForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tripId = searchParams.get('tripId')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [trip, setTrip] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (tripId) {
      fetchTripDetails()
    }
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
      setTimeout(() => {
        navigate('/schedule')
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
            transition: 'color 0.2s'
          }}
        >
          ★
        </button>
      )
    }
    return stars
  }

  if (!tripId) {
    return (
      <div className="card">
        <div className="alert alert-warning">
          No trip selected for feedback. Please go to your trips and select "Rate Trip".
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/schedule')}>
          Back to Schedule
        </button>
      </div>
    )
  }

  if (error && !trip) {
    return (
      <div className="card">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/schedule')}>
          Back to Schedule
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Rate Your Trip</h2>
      </div>

      {trip && (
        <div className="trip-info" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
          <p><strong>Route:</strong> {trip.route}</p>
          <p><strong>Date:</strong> {trip.trip_date}</p>
          <p><strong>Time:</strong> {trip.trip_time}</p>
          <p><strong>Driver:</strong> {trip.driver_name || 'N/A'}</p>
          <p><strong>Vehicle:</strong> {trip.registration_number || 'N/A'}</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Your Rating *</label>
          <div className="star-rating" style={{ display: 'flex', gap: '0.25rem' }}>
            {renderStars()}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            {rating === 1 && '⭐ Poor - Very dissatisfied'}
            {rating === 2 && '⭐⭐ Fair - Below expectations'}
            {rating === 3 && '⭐⭐⭐ Good - Satisfactory'}
            {rating === 4 && '⭐⭐⭐⭐ Very Good - Above expectations'}
            {rating === 5 && '⭐⭐⭐⭐⭐ Excellent - Highly satisfied'}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Your Comments</label>
          <textarea
            className="form-textarea"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience... Was the driver professional? Was the bus clean? On time? Any suggestions for improvement?"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/schedule')}>
            Skip
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>

      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>💡 Tip:</strong> Your feedback helps us improve service quality.
        Driver ratings are used for performance evaluation.
      </div>
    </div>
  )
}

export default FeedbackForm