import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }
    
    setLoading(false)
  }

  return (
    <>
      <style>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --bg-page: #ffffff; /* Clean white background */
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

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          border-radius: 16px;
          background: var(--bg-card);
          /* Subtle shadow to separate white card from white background */
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.025em;
        }

        .login-header h2 {
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

        .form-links {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
        }

        .forgot-password {
          font-size: 0.875rem;
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-password:hover {
          text-decoration: underline;
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

        .login-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .demo-box {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Injibara University</h1>
            <h2>Transport Management System</h2>
          </div>
        
          {error && <div className="alert-error">{error}</div>}
        
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                autoComplete="email"
              />
            </div>
          
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          
            <div className="form-links">
              <Link to="/reset-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
          
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        
          <div className="login-footer">
            <div className="demo-box">
              <p><strong>Demo Accounts:</strong></p>
              <p>admin@transport.com / Admin@123</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login