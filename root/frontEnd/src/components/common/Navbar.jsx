import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')  // Redirect to landing page after logout
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        🚌 Injibara Transport System
      </Link>
      
      <div className="navbar-user">
        <span>Welcome, {user?.full_name || 'User'}</span>
        <span className="badge badge-info">
          {user?.role_name?.replace('_', ' ') || 'Guest'}
        </span>
        <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar