const ValidationService = {
    // Validate email format
    isValidEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone number (Ethiopian format)
    isValidPhone: (phone) => {
        const cleaned = phone?.toString().replace(/\D/g, '');
        return cleaned && (cleaned.length === 9 || cleaned.length === 10 || cleaned.length === 12);
    },

    // Validate password strength
    isValidPassword: (password) => {
        if (!password || password.length < 8) return false;
        if (!/[0-9]/.test(password)) return false;
        if (!/[!@#$%^&*]/.test(password)) return false;
        return true;
    },

    // Validate date
    isValidDate: (date) => {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    },

    // Validate future date
    isFutureDate: (date) => {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
    },

    // Validate past date
    isPastDate: (date) => {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d <= today;
    },

    // Validate time format (HH:MM:SS or HH:MM)
    isValidTime: (time) => {
        const re = /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return re.test(time);
    },

    // Validate registration number format (AA-1234)
    isValidRegistrationNumber: (regNumber) => {
        const re = /^[A-Z]{2}-\d{4}$/i;
        return re.test(regNumber);
    },

    // Validate capacity
    isValidCapacity: (capacity) => {
        const num = parseInt(capacity);
        return !isNaN(num) && num >= 1 && num <= 60;
    },

    // Validate rating
    isValidRating: (rating) => {
        const num = parseInt(rating);
        return !isNaN(num) && num >= 1 && num <= 5;
    },

    // Validate positive number
    isPositiveNumber: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
    },

    // Validate non-negative number
    isNonNegativeNumber: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
    },

    // Validate integer
    isInteger: (value) => {
        const num = parseInt(value);
        return !isNaN(num) && num === parseFloat(value);
    },

    // Validate license expiry
    isValidLicenseExpiry: (expiryDate) => {
        const d = new Date(expiryDate);
        return d instanceof Date && !isNaN(d);
    },

    // Validate mileage progression (new > previous)
    isValidMileageProgression: (newMileage, previousMileage) => {
        return newMileage > previousMileage;
    },

    // Validate driver hours limit
    isValidDriverHours: (currentHours, newTripHours = 2) => {
        return (currentHours + newTripHours) <= 48;
    },

    // Validate vehicle status transition
    isValidVehicleStatusTransition: (currentStatus, newStatus) => {
        const validTransitions = {
            'active': ['maintenance', 'retired'],
            'maintenance': ['active', 'retired'],
            'retired': []
        };
        return validTransitions[currentStatus]?.includes(newStatus) || false;
    },

    // Validate trip status transition
    isValidTripStatusTransition: (currentStatus, newStatus) => {
        const validTransitions = {
            'scheduled': ['in_progress', 'cancelled', 'delayed'],
            'in_progress': ['completed', 'delayed'],
            'delayed': ['in_progress', 'cancelled', 'completed'],
            'completed': [],
            'cancelled': []
        };
        return validTransitions[currentStatus]?.includes(newStatus) || false;
    },

    // Validate request status transition
    isValidRequestStatusTransition: (currentStatus, newStatus) => {
        const validTransitions = {
            'pending': ['approved', 'rejected'],
            'approved': ['scheduled'],
            'rejected': [],
            'scheduled': []
        };
        return validTransitions[currentStatus]?.includes(newStatus) || false;
    },

    // Validate incident status transition
    isValidIncidentStatusTransition: (currentStatus, newStatus) => {
        const validTransitions = {
            'draft': ['submitted'],
            'submitted': []
        };
        return validTransitions[currentStatus]?.includes(newStatus) || false;
    },

    // Sanitize input (remove special characters)
    sanitizeString: (str) => {
        if (!str) return '';
        return str.replace(/[<>]/g, '').trim();
    },

    // Validate required fields
    validateRequired: (data, requiredFields) => {
        const missing = [];
        for (const field of requiredFields) {
            if (!data[field] || data[field].toString().trim() === '') {
                missing.push(field);
            }
        }
        return { valid: missing.length === 0, missing };
    },

    // Validate object against schema
    validateSchema: (data, schema) => {
        const errors = [];
        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];
            
            if (rules.required && (!value || value.toString().trim() === '')) {
                errors.push(`${field} is required`);
                continue;
            }
            
            if (value && rules.type) {
                if (rules.type === 'email' && !ValidationService.isValidEmail(value)) {
                    errors.push(`${field} must be a valid email`);
                }
                if (rules.type === 'phone' && !ValidationService.isValidPhone(value)) {
                    errors.push(`${field} must be a valid phone number`);
                }
                if (rules.type === 'number' && !ValidationService.isPositiveNumber(value)) {
                    errors.push(`${field} must be a positive number`);
                }
                if (rules.type === 'integer' && !ValidationService.isInteger(value)) {
                    errors.push(`${field} must be an integer`);
                }
            }
            
            if (value && rules.min !== undefined && value < rules.min) {
                errors.push(`${field} must be at least ${rules.min}`);
            }
            
            if (value && rules.max !== undefined && value > rules.max) {
                errors.push(`${field} must be at most ${rules.max}`);
            }
        }
        
        return { valid: errors.length === 0, errors };
    }
};

module.exports = ValidationService;