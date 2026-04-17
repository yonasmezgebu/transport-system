import { useAuth } from '../contexts/AuthContext'

const useAuthHook = () => {
  const { user, isAuthenticated, loading, login, logout, hasRole } = useAuth()
  
  const isTransportManager = () => hasRole('transport_manager')
  const isFleetOfficer = () => hasRole('fleet_officer')
  const isDriver = () => hasRole('driver')
  const isStaff = () => hasRole('staff')
  const isStudent = () => hasRole('student')
  const isDepartmentHead = () => hasRole('department_head')
  const isUniversityAdmin = () => hasRole('university_admin')
  const isGateGuard = () => hasRole('gate_guard')
  
  const getUserName = () => user?.full_name || 'User'
  const getUserEmail = () => user?.email || ''
  const getUserRole = () => user?.role_name || ''
  const getUserId = () => user?.user_id || null
  
  const isAdmin = () => {
    return hasRole(['transport_manager', 'university_admin'])
  }
  
  const canManageTrips = () => {
    return hasRole(['transport_manager'])
  }
  
  const canManageVehicles = () => {
    return hasRole(['fleet_officer', 'transport_manager'])
  }
  
  const canViewReports = () => {
    return hasRole(['transport_manager', 'fleet_officer', 'university_admin'])
  }
  
  const canSubmitRequests = () => {
    return hasRole(['staff', 'department_head'])
  }
  
  const canProvideFeedback = () => {
    return hasRole(['staff', 'student'])
  }

  return {
    // Core auth
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    
    // Role checks
    isTransportManager,
    isFleetOfficer,
    isDriver,
    isStaff,
    isStudent,
    isDepartmentHead,
    isUniversityAdmin,
    isGateGuard,
    isAdmin,
    
    // Permission checks
    canManageTrips,
    canManageVehicles,
    canViewReports,
    canSubmitRequests,
    canProvideFeedback,
    
    // User info
    getUserName,
    getUserEmail,
    getUserRole,
    getUserId
  }
}

export default useAuthHook