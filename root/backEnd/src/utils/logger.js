const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }
        if (stack) {
            log += `\n${stack}`;
        }
        return log;
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        // Error log file
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 10485760, // 10MB
            maxFiles: 5
        }),
        // Combined log file
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 10485760, // 10MB
            maxFiles: 5
        }),
        // Access log file
        new winston.transports.File({
            filename: path.join(logDir, 'access.log'),
            level: 'info',
            maxsize: 10485760,
            maxFiles: 5
        })
    ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Create stream for morgan HTTP logging
const stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

// Log HTTP request
const logRequest = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            userId: req.user?.user_id || 'anonymous'
        });
    });
    
    next();
};

// Log database query
const logQuery = (query, params, duration) => {
    logger.debug({
        type: 'database_query',
        query: query,
        params: params,
        duration: `${duration}ms`
    });
};

// Log error with context
const logError = (error, context = {}) => {
    logger.error({
        message: error.message,
        stack: error.stack,
        ...context
    });
};

// Log info with context
const logInfo = (message, context = {}) => {
    logger.info({ message, ...context });
};

// Log warning with context
const logWarning = (message, context = {}) => {
    logger.warn({ message, ...context });
};

// Log debug with context
const logDebug = (message, context = {}) => {
    logger.debug({ message, ...context });
};

// Log audit action
const logAudit = (userId, action, entityType, entityId, details = {}) => {
    logger.info({
        type: 'audit',
        userId,
        action,
        entityType,
        entityId,
        details,
        timestamp: new Date().toISOString()
    });
};

// Log security event
const logSecurity = (event, userId, ip, details = {}) => {
    logger.warn({
        type: 'security',
        event,
        userId,
        ip,
        details,
        timestamp: new Date().toISOString()
    });
};

// Log performance metric
const logPerformance = (operation, duration, metadata = {}) => {
    logger.info({
        type: 'performance',
        operation,
        duration: `${duration}ms`,
        ...metadata
    });
};

module.exports = {
    logger,
    stream,
    logRequest,
    logQuery,
    logError,
    logInfo,
    logWarning,
    logDebug,
    logAudit,
    logSecurity,
    logPerformance
};