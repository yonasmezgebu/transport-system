import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    
    try {
      await api.post('/auth/reset-password', { email })
      setMessage('Password reset link has been sent to your email address.')
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        :root {
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
          --bg-gray: #f8fafc;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: #e2e8f0;
        }

        .reset-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-gray);
          font-family: 'Inter', -apple-system, sans-serif;
          padding: 20px;
        }

        .reset-card {
          background: #ffffff;
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border);
        }

        .reset-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .reset-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .reset-header p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--text-main);
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          outline: none;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .btn-primary {
          width: 100%;
          padding: 12px;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .alert {
          padding: 12px;
          border-radius: 6px;
          font-size: 0.875rem;
          margin-bottom: 20px;
          border: 1px solid transparent;
          text-align: center;
        }

        .alert-success {
          background-color: #f0fdf4;
          color: #166534;
          border-color: #bbf7d0;
        }

        .alert-error {
          background-color: #fef2f2;
          color: #991b1b;
          border-color: #fee2e2;
        }

        .reset-footer {
          margin-top: 24px;
          text-align: center;
        }

        .back-link {
          font-size: 0.875rem;
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }

        .back-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="reset-container">
        <div className="reset-card">
          <div className="reset-header">
            <h2>Reset Password</h2>
            <p>Enter your email to receive a reset link</p>
          </div>
          
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
                autoComplete="email"
              />
            </div>
            
            <button 
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="reset-footer">
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword