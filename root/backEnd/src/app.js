const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { logRequest, stream } = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const fuelRoutes = require('./routes/fuelRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const requestRoutes = require('./routes/requestRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const gateRoutes = require('./routes/gateRoutes');

// Create Express app
const app = express();

// ============================================
// Security Middleware
// ============================================

// Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Compression for responses
app.use(compression());

// ============================================
// Logging Middleware
// ============================================

// Morgan HTTP logging
app.use(morgan('combined', { stream }));
app.use(logRequest);

// ============================================
// Body Parsing Middleware
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Static Files
// ============================================

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/docs', express.static(path.join(__dirname, '../../docs')));

// ============================================
// Global Rate Limiter
// ============================================

app.use('/api/', apiLimiter);

// ============================================
// Health Check Endpoint
// ============================================

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/health/detailed', async (req, res) => {
    const pool = require('./config/database');
    let dbStatus = 'disconnected';
    
    try {
        await pool.query('SELECT 1');
        dbStatus = 'connected';
    } catch (error) {
        dbStatus = 'error';
    }
    
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus,
        memory: process.memoryUsage(),
        node_version: process.version
    });
});

// ============================================
// API Routes
// ============================================

// Authentication routes
app.use('/api/auth', authRoutes);

// User management routes
app.use('/api/users', userRoutes);

// Transport manager routes
app.use('/api/trips', tripRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/requests', requestRoutes);

// Fleet officer routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Driver routes
app.use('/api/incidents', incidentRoutes);

// Report routes
app.use('/api/reports', reportRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Gate guard routes
app.use('/api/gate', gateRoutes);

// ============================================
// API Documentation Endpoint
// ============================================

app.get('/api/docs', (req, res) => {
    res.json({
        name: 'Injibara University Transport System API',
        version: '1.0.0',
        endpoints: {
            auth: {
                login: 'POST /api/auth/login',
                logout: 'POST /api/auth/logout',
                me: 'GET /api/auth/me',
                resetPassword: 'POST /api/auth/reset-password'
            },
            trips: {
                getAll: 'GET /api/trips',
                getById: 'GET /api/trips/:id',
                create: 'POST /api/trips',
                update: 'PUT /api/trips/:id',
                updateStatus: 'PUT /api/trips/:id/status',
                cancel: 'DELETE /api/trips/:id'
            },
            vehicles: {
                getAll: 'GET /api/vehicles',
                getById: 'GET /api/vehicles/:id',
                create: 'POST /api/vehicles',
                update: 'PUT /api/vehicles/:id',
                delete: 'DELETE /api/vehicles/:id'
            },
            drivers: {
                getAll: 'GET /api/drivers',
                getById: 'GET /api/drivers/:id',
                create: 'POST /api/drivers',
                update: 'PUT /api/drivers/:id',
                delete: 'DELETE /api/drivers/:id',
                hours: 'GET /api/drivers/:id/hours'
            },
            fuel: {
                record: 'POST /api/fuel/logs',
                getLogs: 'GET /api/fuel/logs/vehicle/:vehicle_id',
                report: 'GET /api/fuel/report'
            },
            maintenance: {
                record: 'POST /api/maintenance/records',
                upcoming: 'GET /api/maintenance/upcoming',
                history: 'GET /api/maintenance/history/:vehicle_id',
                report: 'GET /api/maintenance/report'
            },
            requests: {
                submit: 'POST /api/requests',
                getAll: 'GET /api/requests',
                getById: 'GET /api/requests/:id',
                approve: 'PUT /api/requests/:id/approve',
                reject: 'PUT /api/requests/:id/reject'
            },
            incidents: {
                create: 'POST /api/incidents',
                submit: 'PUT /api/incidents/:id/submit',
                getAll: 'GET /api/incidents',
                getById: 'GET /api/incidents/:id',
                uploadPhoto: 'POST /api/incidents/:id/photos'
            },
            reports: {
                operational: 'GET /api/reports/operational',
                financial: 'GET /api/reports/financial',
                drivers: 'GET /api/reports/drivers',
                vehicles: 'GET /api/reports/vehicles'
            },
            gate: {
                todaySchedule: 'GET /api/gate/schedule/today',
                recordEntry: 'POST /api/gate/entry/:trip_id',
                recordExit: 'POST /api/gate/exit/:trip_id',
                verify: 'GET /api/gate/verify/:registration_number'
            },
            notifications: {
                getAll: 'GET /api/notifications',
                markRead: 'PUT /api/notifications/:id/read',
                markAllRead: 'PUT /api/notifications/read-all'
            }
        }
    });
});

// ============================================
// Error Handling Middleware
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// Graceful Shutdown
// ============================================

let server = null;

const gracefulShutdown = async () => {
    console.log('Received shutdown signal, closing server...');
    
    if (server) {
        server.close(async () => {
            console.log('HTTP server closed');
            
            // Close database connections
            const pool = require('./config/database');
            await pool.end();
            console.log('Database connections closed');
            
            process.exit(0);
        });
    }
    
    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Export app for testing
module.exports = app;