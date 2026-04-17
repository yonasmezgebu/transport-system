const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: {
        error: 'Too many requests',
        message: 'Please slow down. You have exceeded the rate limit.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for certain IPs (whitelist)
        const whitelist = ['127.0.0.1', '::1'];
        return whitelist.includes(req.ip);
    }
});

// Login rate limiter (stricter)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: {
        error: 'Too many login attempts',
        message: 'Please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // Don't count successful logins
});

// Password reset rate limiter
const resetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: {
        error: 'Too many reset attempts',
        message: 'Please try again after 1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Trip creation rate limiter
const tripCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 trips per hour
    message: {
        error: 'Too many trip creation attempts',
        message: 'Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Report generation rate limiter
const reportLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 reports per minute
    message: {
        error: 'Too many report requests',
        message: 'Please wait before generating more reports'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// File upload rate limiter
const uploadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 uploads per minute
    message: {
        error: 'Too many upload attempts',
        message: 'Please wait before uploading more files'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// SMS sending rate limiter
const smsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 SMS per minute
    message: {
        error: 'Too many SMS requests',
        message: 'Please wait before sending more messages'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Email sending rate limiter
const emailLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 emails per minute
    message: {
        error: 'Too many email requests',
        message: 'Please wait before sending more emails'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Export all limiters
module.exports = {
    apiLimiter,
    loginLimiter,
    resetLimiter,
    tripCreationLimiter,
    reportLimiter,
    uploadLimiter,
    smsLimiter,
    emailLimiter
};