// Route Constants
export const ROUTES = {
  CAMPUS_TO_INJIBARA: 'Campus to Injibara Town',
  CAMPUS_TO_ZENGENA: 'Campus to Zengena',
  CAMPUS_TO_CHAGNI: 'Campus to Chagni',
  CAMPUS_TO_DANGILA: 'Campus to Dangila',
  CAMPUS_TO_STAFF_HOUSING: 'Campus to Staff Housing'
}

export const ROUTES_LIST = Object.values(ROUTES)

// Trip Categories
export const TRIP_CATEGORIES = {
  REGULAR: 'regular',
  SPECIAL_EVENT: 'special_event',
  FIELD_TRIP: 'field_trip',
  WEEKEND_PROGRAM: 'weekend_program',
  EVENING_CLASS: 'evening_class'
}

export const TRIP_CATEGORIES_LIST = [
  { value: 'regular', label: 'Regular' },
  { value: 'special_event', label: 'Special Event' },
  { value: 'field_trip', label: 'Field Trip' },
  { value: 'weekend_program', label: 'Weekend Program' },
  { value: 'evening_class', label: 'Evening Class' }
]

// Trip Status
export const TRIP_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DELAYED: 'delayed'
}

export const TRIP_STATUS_LIST = [
  { value: 'scheduled', label: 'Scheduled', color: 'info' },
  { value: 'in_progress', label: 'In Progress', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'danger' },
  { value: 'delayed', label: 'Delayed', color: 'warning' }
]

// Vehicle Status
export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired'
}

export const VEHICLE_STATUS_LIST = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'maintenance', label: 'Maintenance', color: 'warning' },
  { value: 'retired', label: 'Retired', color: 'danger' }
]

// Fuel Types
export const FUEL_TYPES = {
  PETROL: 'petrol',
  DIESEL: 'diesel'
}

export const FUEL_TYPES_LIST = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' }
]

// Incident Types
export const INCIDENT_TYPES = {
  TRAFFIC: 'traffic',
  ROAD_DAMAGE: 'road_damage',
  MECHANICAL: 'mechanical',
  BREAKDOWN: 'breakdown'
}

export const INCIDENT_TYPES_LIST = [
  { value: 'traffic', label: '🚗 Traffic Accident', color: 'danger' },
  { value: 'road_damage', label: '🛣️ Road Damage', color: 'warning' },
  { value: 'mechanical', label: '🔧 Mechanical Issue', color: 'warning' },
  { value: 'breakdown', label: '⚠️ Vehicle Breakdown', color: 'danger' }
]

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SCHEDULED: 'scheduled'
}

export const REQUEST_STATUS_LIST = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'danger' },
  { value: 'scheduled', label: 'Scheduled', color: 'info' }
]

// Notification Types
export const NOTIFICATION_TYPES = {
  SCHEDULE_CHANGE: 'schedule_change',
  APPROVAL: 'approval',
  MAINTENANCE: 'maintenance',
  DOCUMENT_EXPIRY: 'document_expiry',
  HOUR_WARNING: 'hour_warning'
}

// User Roles
export const USER_ROLES = {
  TRANSPORT_MANAGER: 'transport_manager',
  FLEET_OFFICER: 'fleet_officer',
  DRIVER: 'driver',
  STAFF: 'staff',
  STUDENT: 'student',
  DEPARTMENT_HEAD: 'department_head',
  UNIVERSITY_ADMIN: 'university_admin',
  GATE_GUARD: 'gate_guard'
}

export const USER_ROLES_LIST = [
  { value: 'transport_manager', label: 'Transport Manager' },
  { value: 'fleet_officer', label: 'Fleet Officer' },
  { value: 'driver', label: 'Driver' },
  { value: 'staff', label: 'Staff' },
  { value: 'student', label: 'Student' },
  { value: 'department_head', label: 'Department Head' },
  { value: 'university_admin', label: 'University Admin' },
  { value: 'gate_guard', label: 'Gate Guard' }
]

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  TRIPS: '/trips',
  VEHICLES: '/vehicles',
  DRIVERS: '/drivers',
  FUEL: '/fuel',
  MAINTENANCE: '/maintenance',
  REQUESTS: '/requests',
  INCIDENTS: '/incidents',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  GATE: '/gate'
}

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const DEFAULT_PAGE = 1

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD'
export const TIME_FORMAT = 'HH:mm:ss'
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY'
export const DISPLAY_TIME_FORMAT = 'hh:mm A'

// Limits
export const MAX_DRIVER_HOURS_PER_WEEK = 48
export const MAX_DRIVER_HOURS_PER_DAY = 8
export const MAX_PHOTO_SIZE_MB = 5
export const MAX_PHOTOS_PER_INCIDENT = 5
export const SESSION_TIMEOUT_MINUTES = 30