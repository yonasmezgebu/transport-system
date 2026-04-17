// User Roles
const USER_ROLES = {
    TRANSPORT_MANAGER: 'transport_manager',
    FLEET_OFFICER: 'fleet_officer',
    DRIVER: 'driver',
    STAFF: 'staff',
    STUDENT: 'student',
    DEPARTMENT_HEAD: 'department_head',
    UNIVERSITY_ADMIN: 'university_admin',
    GATE_GUARD: 'gate_guard'
};

const USER_ROLES_LIST = Object.values(USER_ROLES);

// Trip Status
const TRIP_STATUS = {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    DELAYED: 'delayed'
};

const TRIP_STATUS_LIST = Object.values(TRIP_STATUS);

// Trip Categories
const TRIP_CATEGORIES = {
    REGULAR: 'regular',
    SPECIAL_EVENT: 'special_event',
    FIELD_TRIP: 'field_trip',
    WEEKEND_PROGRAM: 'weekend_program',
    EVENING_CLASS: 'evening_class'
};

const TRIP_CATEGORIES_LIST = Object.values(TRIP_CATEGORIES);

// Vehicle Status
const VEHICLE_STATUS = {
    ACTIVE: 'active',
    MAINTENANCE: 'maintenance',
    RETIRED: 'retired'
};

const VEHICLE_STATUS_LIST = Object.values(VEHICLE_STATUS);

// Fuel Types
const FUEL_TYPES = {
    PETROL: 'petrol',
    DIESEL: 'diesel'
};

const FUEL_TYPES_LIST = Object.values(FUEL_TYPES);

// Incident Types
const INCIDENT_TYPES = {
    TRAFFIC: 'traffic',
    ROAD_DAMAGE: 'road_damage',
    MECHANICAL: 'mechanical',
    BREAKDOWN: 'breakdown'
};

const INCIDENT_TYPES_LIST = Object.values(INCIDENT_TYPES);

// Request Status
const REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SCHEDULED: 'scheduled'
};

const REQUEST_STATUS_LIST = Object.values(REQUEST_STATUS);

// Notification Types
const NOTIFICATION_TYPES = {
    SCHEDULE_CHANGE: 'schedule_change',
    APPROVAL: 'approval',
    MAINTENANCE: 'maintenance',
    DOCUMENT_EXPIRY: 'document_expiry',
    HOUR_WARNING: 'hour_warning',
    INCIDENT_REPORTED: 'incident_reported'
};

const NOTIFICATION_TYPES_LIST = Object.values(NOTIFICATION_TYPES);

// Routes
const ROUTES = {
    CAMPUS_TO_INJIBARA: 'Campus to Injibara Town',
    CAMPUS_TO_ZENGENA: 'Campus to Zengena',
    CAMPUS_TO_CHAGNI: 'Campus to Chagni',
    CAMPUS_TO_DANGILA: 'Campus to Dangila',
    CAMPUS_TO_STAFF_HOUSING: 'Campus to Staff Housing'
};

const ROUTES_LIST = Object.values(ROUTES);

// Limits
const LIMITS = {
    MAX_DRIVER_HOURS_PER_WEEK: 48,
    MAX_DRIVER_HOURS_PER_DAY: 8,
    DEFAULT_TRIP_DURATION_HOURS: 2,
    CONFLICT_BUFFER_MINUTES: 30,
    MAX_PHOTO_SIZE_MB: 5,
    MAX_PHOTOS_PER_INCIDENT: 5,
    SESSION_TIMEOUT_MINUTES: 30,
    PASSWORD_MIN_LENGTH: 8,
    TOKEN_EXPIRY_HOURS: 24,
    REFRESH_TOKEN_EXPIRY_DAYS: 7,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    MAINTENANCE_ALERT_DAYS: 7,
    DOCUMENT_EXPIRY_ALERT_DAYS: 30
};

// HTTP Status Codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

// Error Codes
const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    REFERENCED_RECORD: 'REFERENCED_RECORD',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    CONFLICT: 'CONFLICT',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE'
};

// Audit Actions
const AUDIT_ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    CREATE_TRIP: 'CREATE_TRIP',
    UPDATE_TRIP: 'UPDATE_TRIP',
    CANCEL_TRIP: 'CANCEL_TRIP',
    CREATE_DRIVER: 'CREATE_DRIVER',
    UPDATE_DRIVER: 'UPDATE_DRIVER',
    DELETE_DRIVER: 'DELETE_DRIVER',
    CREATE_VEHICLE: 'CREATE_VEHICLE',
    UPDATE_VEHICLE: 'UPDATE_VEHICLE',
    DELETE_VEHICLE: 'DELETE_VEHICLE',
    APPROVE_REQUEST: 'APPROVE_REQUEST',
    REJECT_REQUEST: 'REJECT_REQUEST',
    RECORD_FUEL: 'RECORD_FUEL',
    RECORD_MAINTENANCE: 'RECORD_MAINTENANCE',
    GATE_ENTRY: 'GATE_ENTRY',
    GATE_EXIT: 'GATE_EXIT'
};

// Date Formats
const DATE_FORMATS = {
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY_DATE: 'MMM DD, YYYY',
    DISPLAY_TIME: 'hh:mm A',
    DISPLAY_DATETIME: 'MMM DD, YYYY hh:mm A'
};

// File Upload Configurations
const UPLOAD_CONFIG = {
    INCIDENT_PHOTOS: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        maxFiles: 5
    },
    DOCUMENTS: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        maxFiles: 1
    },
    PROFILE_PICTURES: {
        maxSize: 2 * 1024 * 1024, // 2MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        maxFiles: 1
    }
};

// Pagination Defaults
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
};

// Cache Keys
const CACHE_KEYS = {
    TRIPS: 'trips',
    VEHICLES: 'vehicles',
    DRIVERS: 'drivers',
    REQUESTS: 'requests',
    NOTIFICATIONS: 'notifications',
    USER_SESSION: 'user_session'
};

// Cache TTL (seconds)
const CACHE_TTL = {
    TRIPS: 300, // 5 minutes
    VEHICLES: 600, // 10 minutes
    DRIVERS: 600,
    SCHEDULE: 60, // 1 minute
    REPORTS: 3600 // 1 hour
};

module.exports = {
    USER_ROLES,
    USER_ROLES_LIST,
    TRIP_STATUS,
    TRIP_STATUS_LIST,
    TRIP_CATEGORIES,
    TRIP_CATEGORIES_LIST,
    VEHICLE_STATUS,
    VEHICLE_STATUS_LIST,
    FUEL_TYPES,
    FUEL_TYPES_LIST,
    INCIDENT_TYPES,
    INCIDENT_TYPES_LIST,
    REQUEST_STATUS,
    REQUEST_STATUS_LIST,
    NOTIFICATION_TYPES,
    NOTIFICATION_TYPES_LIST,
    ROUTES,
    ROUTES_LIST,
    LIMITS,
    HTTP_STATUS,
    ERROR_CODES,
    AUDIT_ACTIONS,
    DATE_FORMATS,
    UPLOAD_CONFIG,
    PAGINATION,
    CACHE_KEYS,
    CACHE_TTL
};