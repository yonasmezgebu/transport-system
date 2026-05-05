import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = () => {
  const { user } = useAuth()
  const role = user?.role_name

  const menuItems = {
    transport_manager: [
      { path: '/trips', label: 'Trips', icon: '🚌' },
      { path: '/trips/new', label: 'Create Trip', icon: '➕' },
      { path: '/drivers', label: 'Drivers', icon: '👨‍✈️' },
      { path: '/vehicles', label: 'Vehicles', icon: '🚗' },
      { path: '/requests', label: 'Requests', icon: '📋' },
      { path: '/reports', label: 'Reports', icon: '📈' }
    ],
    fleet_officer: [
      { path: '/vehicles', label: 'Vehicles', icon: '🚗' },
      { path: '/vehicles/new', label: 'Add Vehicle', icon: '➕' },
      { path: '/fuel', label: 'Fuel Logs', icon: '⛽' },
      { path: '/maintenance', label: 'Maintenance', icon: '🔧' }
    ],
    driver: [
      { path: '/my-trips', label: 'My Trips', icon: '🚌' },
      { path: '/incidents/new', label: 'Report Incident', icon: '⚠️' }
    ],
    staff: [
      { path: '/schedule', label: 'Schedule', icon: '📅' },
      { path: '/request-transport', label: 'Request Transport', icon: '📝' }
    ],
    student: [
      { path: '/student-schedule', label: 'Schedule', icon: '📅' },
      { path: '/student-feedback', label: 'Feedback', icon: '⭐' }
    ],
    gate_guard: [
      { path: '/gate', label: 'Gate Schedule', icon: '🚪' }
    ],
    university_admin: [
      { path: '/admin-reports', label: 'Reports', icon: '📈' },
      { path: '/admin-users', label: 'User Management', icon: '👥' }
    ]
  }

  const items = menuItems[role] || menuItems.staff

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar