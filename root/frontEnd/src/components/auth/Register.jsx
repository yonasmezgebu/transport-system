import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register-staff', {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      navigate('/login', { state: { message: 'Registration successful! You can now login.' } })
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --bg-page: #ffffff;
          --bg-card: #ffffff;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --input-bg: #f8fafc;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: var(--bg-page);
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          color: var(--text-main);
        }

        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .register-card {
          width: 100%;
          max-width: 480px;
          padding: 40px;
          border-radius: 16px;
          background: var(--bg-card);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border);
        }

        .register-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .register-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.025em;
        }

        .register-header h2 {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 400;
          margin-top: 8px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-main);
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 1rem;
          background-color: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-input:focus {
          background-color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background-color: var(--primary);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin-top: 10px;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: var(--primary-dark);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .alert-error {
          background-color: #fef2f2;
          color: #b91c1c;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 24px;
          border: 1px solid #fee2e2;
          text-align: center;
        }

        .register-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .register-footer a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }

        .register-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 24px;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Injibara University</h1>
            <h2>Staff Registration Portal</h2>
          </div>
        
          {error && <div className="alert-error">{error}</div>}
        
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="full_name"
                className="form-input"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Abebe Kebede"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="staff@example.com"
                autoComplete="email"
              />
            </div>
          
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="0912345678"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Staff'}
            </button>
          </form>
        
          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
