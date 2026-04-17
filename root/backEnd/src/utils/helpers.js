const crypto = require('crypto');

// Generate random ID
const generateRandomId = (prefix = '') => {
    const random = crypto.randomBytes(8).toString('hex');
    return prefix ? `${prefix}_${random}` : random;
};

// Generate OTP
const generateOTP = (length = 6) => {
    return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
};

// Format date to YYYY-MM-DD
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

// Format datetime
const formatDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().replace('T', ' ').substring(0, 19);
};

// Parse date from string
const parseDate = (dateString) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? null : d;
};

// Check if date is valid
const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
};

// Calculate days between dates
const daysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Format Ethiopian phone number
const formatEthiopianPhone = (phone) => {
    if (!phone) return null;
    let cleaned = phone.toString().replace(/\D/g, '');
    if (cleaned.length === 9 && cleaned.startsWith('9')) {
        return `251${cleaned}`;
    }
    if (cleaned.length === 10 && cleaned.startsWith('09')) {
        return `251${cleaned.substring(1)}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('251')) {
        return cleaned;
    }
    return null;
};

// Mask sensitive data
const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
};

const maskPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.toString().replace(/\D/g, '');
    if (cleaned.length <= 4) return '****';
    return `${cleaned.substring(0, 3)}****${cleaned.substring(cleaned.length - 2)}`;
};

// Calculate pagination
const getPagination = (page, limit, total) => {
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 20;
    const totalPages = Math.ceil(total / perPage);
    const offset = (currentPage - 1) * perPage;
    
    return {
        current_page: currentPage,
        per_page: perPage,
        total: total,
        total_pages: totalPages,
        offset: offset,
        has_next: currentPage < totalPages,
        has_prev: currentPage > 1
    };
};

// Build query parameters
const buildQueryParams = (params) => {
    const filtered = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    return filtered.length ? `?${filtered.join('&')}` : '';
};

// Parse query parameters for filtering
const parseFilterParams = (query, allowedFields) => {
    const filters = {};
    for (const field of allowedFields) {
        if (query[field]) {
            filters[field] = query[field];
        }
    }
    return filters;
};

// Calculate trip duration
const calculateTripDuration = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return { hours, minutes, totalMinutes: durationMinutes };
};

// Calculate fuel efficiency
const calculateFuelEfficiency = (previousMileage, currentMileage, liters) => {
    const distance = currentMileage - previousMileage;
    if (liters <= 0 || distance <= 0) return 0;
    return parseFloat((distance / liters).toFixed(2));
};

// Calculate average rating
const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return parseFloat((sum / ratings.length).toFixed(1));
};

// Group array by key
const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
};

// Sort array by field
const sortBy = (array, field, direction = 'asc') => {
    return [...array].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
    });
};

// Deep clone object
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Sleep/delay function
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function with exponential backoff
const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        await sleep(delay);
        return retry(fn, retries - 1, delay * 2);
    }
};

// Capitalize first letter
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Capitalize each word
const capitalizeWords = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => capitalize(word)).join(' ');
};

// Truncate string
const truncate = (str, maxLength, suffix = '...') => {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength) + suffix;
};

// Escape HTML
const escapeHtml = (str) => {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

// Validate Ethiopian phone number
const isValidEthiopianPhone = (phone) => {
    const formatted = formatEthiopianPhone(phone);
    return formatted !== null;
};

// Extract error message from object
const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
};

module.exports = {
    generateRandomId,
    generateOTP,
    formatDate,
    formatDateTime,
    parseDate,
    isValidDate,
    daysBetween,
    formatEthiopianPhone,
    maskEmail,
    maskPhone,
    getPagination,
    buildQueryParams,
    parseFilterParams,
    calculateTripDuration,
    calculateFuelEfficiency,
    calculateAverageRating,
    groupBy,
    sortBy,
    deepClone,
    sleep,
    retry,
    capitalize,
    capitalizeWords,
    truncate,
    escapeHtml,
    isValidEthiopianPhone,
    getErrorMessage
};