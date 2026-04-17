const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Login validation
const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// Trip validation
const validateTrip = [
    body('trip_date').isDate().withMessage('Valid date is required'),
    body('trip_time').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:?([0-5][0-9])?$/).withMessage('Valid time is required (HH:MM:SS)'),
    body('route').notEmpty().withMessage('Route is required'),
    body('driver_id').isInt().withMessage('Driver selection required'),
    body('vehicle_id').isInt().withMessage('Vehicle selection required'),
    body('expected_passenger_count').optional().isInt({ min: 0 }).withMessage('Passenger count must be a positive number'),
    handleValidationErrors
];

// Vehicle validation
const validateVehicle = [
    body('registration_number').notEmpty().withMessage('Registration number is required'),
    body('model').notEmpty().withMessage('Model is required'),
    body('capacity').isInt({ min: 1, max: 60 }).withMessage('Capacity must be between 1 and 60'),
    body('fuel_type').isIn(['petrol', 'diesel']).withMessage('Fuel type must be petrol or diesel'),
    handleValidationErrors
];

// Driver validation
const validateDriver = [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('license_number').notEmpty().withMessage('License number is required'),
    body('license_expiry').isDate().withMessage('Valid license expiry date is required'),
    body('hire_date').isDate().withMessage('Valid hire date is required'),
    handleValidationErrors
];

// Fuel log validation
const validateFuelLog = [
    body('vehicle_id').isInt().withMessage('Vehicle selection required'),
    body('log_date').isDate().withMessage('Valid date is required'),
    body('liters').isFloat({ min: 0.01 }).withMessage('Liters must be greater than 0'),
    body('cost_etb').isFloat({ min: 0.01 }).withMessage('Cost must be greater than 0'),
    body('mileage').isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
    handleValidationErrors
];

// Maintenance validation
const validateMaintenance = [
    body('vehicle_id').isInt().withMessage('Vehicle selection required'),
    body('type').notEmpty().withMessage('Maintenance type is required'),
    body('maintenance_date').isDate().withMessage('Valid date is required'),
    body('cost_etb').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    body('mileage').isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
    handleValidationErrors
];

// Request validation
const validateRequest = [
    body('purpose').notEmpty().withMessage('Purpose is required'),
    body('requested_date').isDate().withMessage('Valid date is required'),
    body('requested_time').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:?([0-5][0-9])?$/).withMessage('Valid time is required'),
    body('passenger_count').isInt({ min: 1 }).withMessage('Passenger count must be at least 1'),
    body('destination').notEmpty().withMessage('Destination is required'),
    handleValidationErrors
];

// Incident validation
const validateIncident = [
    body('type').isIn(['traffic', 'road_damage', 'mechanical', 'breakdown']).withMessage('Valid incident type is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('incident_date').isDate().withMessage('Valid date is required'),
    body('incident_time').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:?([0-5][0-9])?$/).withMessage('Valid time is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleValidationErrors
];

// User validation (admin create)
const validateUser = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('role_id').isInt().withMessage('Valid role is required'),
    handleValidationErrors
];

// ID param validation
const validateIdParam = [
    param('id').isInt().withMessage('Invalid ID format'),
    handleValidationErrors
];

// Date range validation
const validateDateRange = [
    query('start_date').isDate().withMessage('Valid start date is required'),
    query('end_date').isDate().withMessage('Valid end date is required'),
    query('start_date').custom((value, { req }) => {
        if (new Date(value) > new Date(req.query.end_date)) {
            throw new Error('Start date must be before end date');
        }
        return true;
    }),
    handleValidationErrors
];

// Pagination validation
const validatePagination = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

module.exports = {
    validateLogin,
    validateTrip,
    validateVehicle,
    validateDriver,
    validateFuelLog,
    validateMaintenance,
    validateRequest,
    validateIncident,
    validateUser,
    validateIdParam,
    validateDateRange,
    validatePagination,
    handleValidationErrors
};