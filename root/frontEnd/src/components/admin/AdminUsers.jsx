import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import styles from '../../styles/AdminDashboard.module.css'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await api.delete(`/users/${userId}`)
        fetchUsers()
      } catch (err) {
        alert('Failed to deactivate user')
      }
    }
  }

  if (loading && users.length === 0) return <LoadingSpinner />

  return (
    <div className={styles.adminContainer}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>👥 User Management</h2>
            <p>Manage all system users and their roles</p>
          </div>
          <button className={styles.btnPrimary} onClick={fetchUsers}>
            Refresh List
          </button>
        </div>

        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

        <div className={styles.tableContainer}>
          <table className={styles.modernTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id}>
                <td>
                  <strong>{user.full_name}</strong>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeInfo}`}>
                    {user.role_name.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  {user.is_active ? (
                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>
                  ) : (
                    <span className={`${styles.badge} ${styles.badgeDanger}`}>Inactive</span>
                  )}
                </td>
                <td>
                  <button 
                    className={styles.btnDanger}
                    onClick={() => handleDeleteUser(user.user_id)}
                    disabled={!user.is_active}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}

export default AdminUsers
