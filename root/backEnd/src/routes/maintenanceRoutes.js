const express = require('express');
const {
    recordMaintenance,
    getUpcomingMaintenance,
    getMaintenanceHistory,
    getMaintenanceReport,
    completeMaintenance
} = require('../controllers/maintenanceController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateMaintenance, validateIdParam, validateDateRange } = require('../middleware/validation');
const { apiLimiter, reportLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Fleet officer only routes
router.post('/records', authorize('fleet_officer'), apiLimiter, validateMaintenance, recordMaintenance);
router.get('/upcoming', authorize('fleet_officer'), getUpcomingMaintenance);
router.get('/history/:vehicle_id', authorize('fleet_officer'), validateIdParam, getMaintenanceHistory);
router.put('/:id/complete', authorize('fleet_officer'), validateIdParam, completeMaintenance);

// Report routes
router.get('/report', authorize('fleet_officer', 'university_admin'), reportLimiter, validateDateRange, getMaintenanceReport);

module.exports = router;