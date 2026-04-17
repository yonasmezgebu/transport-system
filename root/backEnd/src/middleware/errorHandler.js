const logger = require('../utils/logger');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        user: req.user?.user_id,
        body: req.body,
        query: req.query
    });

    // MySQL duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ENTRY',
                message: 'A record with this value already exists'
            }
        });
    }

    // MySQL foreign key error
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'REFERENCED_RECORD',
                message: 'Cannot delete because other records reference this item'
            }
        });
    }

    // MySQL data truncation error
    if (err.code === 'ER_DATA_TOO_LONG') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'DATA_TOO_LONG',
                message: 'One or more fields exceed maximum length'
            }
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid authentication token'
            }
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: {
                code: 'TOKEN_EXPIRED',
                message: 'Authentication token has expired'
            }
        });
    }

    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'FILE_TOO_LARGE',
                message: 'File size exceeds the limit (5MB)'
            }
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'TOO_MANY_FILES',
                message: 'Too many files uploaded'
            }
        });
    }

    // Validation errors from express-validator
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: err.message,
                details: err.details
            }
        });
    }

    // Default internal server error
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(err.status || 500).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: isProduction ? 'An unexpected error occurred' : err.message,
            ...(isProduction ? {} : { stack: err.stack })
        }
    });
};

// 404 Not Found handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Cannot ${req.method} ${req.url}`
        }
    });
};

// Async wrapper to catch errors in async routes
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = { errorHandler, notFoundHandler, asyncHandler };