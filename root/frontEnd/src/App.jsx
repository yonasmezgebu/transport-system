import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './components/auth/Login'
import ResetPassword from './components/auth/ResetPassword'
import LandingPage from './components/landing/LandingPage'
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import LoadingSpinner from './components/common/LoadingSpinner'
import AboutPage from './components/landing/pages/AboutPage'
import ServicesPage from './components/landing/pages/ServicesPage'
import FeaturesPage from './components/landing/pages/FeaturesPage'
import ContactPage from './components/landing/pages/ContactPage'


// Lazy load components
const TripList = React.lazy(() => import('./components/transport-manager/TripList'))
const TripForm = React.lazy(() => import('./components/transport-manager/TripForm'))
const DriverList = React.lazy(() => import('./components/transport-manager/DriverList'))
const DriverForm = React.lazy(() => import('./components/transport-manager/DriverForm'))
const RequestList = React.lazy(() => import('./components/transport-manager/RequestList'))
const Reports = React.lazy(() => import('./components/transport-manager/Reports'))

const VehicleList = React.lazy(() => import('./components/fleet-officer/VehicleList'))
const VehicleForm = React.lazy(() => import('./components/fleet-officer/VehicleForm'))
const FuelLogForm = React.lazy(() => import('./components/fleet-officer/FuelLogForm'))
const MaintenanceForm = React.lazy(() => import('./components/fleet-officer/MaintenanceForm'))
const DocumentUpload = React.lazy(() => import('./components/fleet-officer/DocumentUpload'))

const DriverTrips = React.lazy(() => import('./components/driver/DriverTrips'))
const IncidentForm = React.lazy(() => import('./components/driver/IncidentForm'))
const VehicleReport = React.lazy(() => import('./components/driver/VehicleReport'))

const StaffTrips = React.lazy(() => import('./components/staff/StaffTrips'))
const RequestForm = React.lazy(() => import('./components/staff/RequestForm'))
const FeedbackForm = React.lazy(() => import('./components/staff/FeedbackForm'))

const StudentTrips = React.lazy(() => import('./components/student/StudentTrips'))
const StudentFeedback = React.lazy(() => import('./components/student/StudentFeedback'))

const GateSchedule = React.lazy(() => import('./components/gate-guard/GateSchedule'))

const AdminReports = React.lazy(() => import('./components/admin/AdminReports'))

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role_name)) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) return children
  
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <React.Suspense fallback={<LoadingSpinner />}>
            {children}
          </React.Suspense>
        </main>
      </div>
    </div>
  )
}

const DashboardRouter = () => {
  const { user } = useAuth()
  const role = user?.role_name
  
  if (role === 'transport_manager') return <TripList />
  if (role === 'fleet_officer') return <VehicleList />
  if (role === 'driver') return <DriverTrips />
  if (role === 'staff') return <StaffTrips />
  if (role === 'student') return <StudentTrips />
  if (role === 'gate_guard') return <GateSchedule />
  if (role === 'university_admin') return <AdminReports />
  return <TripList />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <DashboardRouter />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Transport Manager Routes */}
      <Route path="/trips" element={
        <ProtectedRoute allowedRoles={['transport_manager']}>
          <AppLayout>
            <TripList />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/trips/new" element={
        <ProtectedRoute allowedRoles={['transport_manager']}>
          <AppLayout>
            <TripForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/drivers" element={
        <ProtectedRoute allowedRoles={['transport_manager']}>
          <AppLayout>
            <DriverList />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/drivers/new" element={
        <ProtectedRoute allowedRoles={['transport_manager']}>
          <AppLayout>
            <DriverForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/requests" element={
        <ProtectedRoute allowedRoles={['transport_manager']}>
          <AppLayout>
            <RequestList />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['transport_manager', 'university_admin']}>
          <AppLayout>
            <Reports />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Fleet Officer Routes */}
      <Route path="/vehicles" element={
        <ProtectedRoute allowedRoles={['fleet_officer', 'transport_manager']}>
          <AppLayout>
            <VehicleList />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/vehicles/new" element={
        <ProtectedRoute allowedRoles={['fleet_officer']}>
          <AppLayout>
            <VehicleForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/fuel" element={
        <ProtectedRoute allowedRoles={['fleet_officer']}>
          <AppLayout>
            <FuelLogForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/maintenance" element={
        <ProtectedRoute allowedRoles={['fleet_officer']}>
          <AppLayout>
            <MaintenanceForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/documents" element={
        <ProtectedRoute allowedRoles={['fleet_officer']}>
          <AppLayout>
            <DocumentUpload />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Driver Routes */}
      <Route path="/my-trips" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <AppLayout>
            <DriverTrips />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/incidents/new" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <AppLayout>
            <IncidentForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/vehicle-report" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <AppLayout>
            <VehicleReport />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Staff Routes */}
      <Route path="/schedule" element={
        <ProtectedRoute allowedRoles={['staff', 'student']}>
          <AppLayout>
            <StaffTrips />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/request-transport" element={
        <ProtectedRoute allowedRoles={['staff', 'department_head']}>
          <AppLayout>
            <RequestForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/feedback/new" element={
        <ProtectedRoute allowedRoles={['staff']}>
          <AppLayout>
            <FeedbackForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Student Routes */}
      <Route path="/student-schedule" element={
        <ProtectedRoute allowedRoles={['student']}>
          <AppLayout>
            <StudentTrips />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student-feedback" element={
        <ProtectedRoute allowedRoles={['student']}>
          <AppLayout>
            <StudentFeedback />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Gate Guard Routes */}
      <Route path="/gate" element={
        <ProtectedRoute allowedRoles={['gate_guard']}>
          <AppLayout>
            <GateSchedule />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin-reports" element={
        <ProtectedRoute allowedRoles={['university_admin']}>
          <AppLayout>
            <AdminReports />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App