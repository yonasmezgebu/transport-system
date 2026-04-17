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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.subtitle}>Enter your email to receive a reset link</p>
        </div>
        
        {message && <div style={{...styles.alert, ...styles.success}}>{message}</div>}
        {error && <div style={{...styles.alert, ...styles.error}}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
              autoComplete="email"
              style={styles.input}
            />
          </div>
          
          <button 
            type="submit"
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <Link to="/login" style={styles.link}>Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    animation: 'fadeIn 0.8s ease'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '26px'
  },
  subtitle: {
    color: '#777',
    fontSize: '14px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center'
  },
  link: {
    color: '#667eea',
    textDecoration: 'none'
  },
  alert: {
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px'
  },
  success: {
    background: '#e6fffa',
    color: '#2c7a7b'
  },
  error: {
    background: '#ffe6e6',
    color: '#c53030'
  }
}

export default ResetPassword

/* Add this to your global CSS for animation */
/* 
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
*/
