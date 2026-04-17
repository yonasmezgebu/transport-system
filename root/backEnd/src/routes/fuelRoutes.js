const express = require('express');
const {
    recordFuelPurchase,
    getFuelLogs,
    getFuelReport,
    getFuelEfficiency
} = require('../controllers/fuelController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateFuelLog, validateIdParam, validateDateRange } = require('../middleware/validation');
const { apiLimiter, reportLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Fleet officer only routes
router.post('/logs', authorize('fleet_officer'), apiLimiter, validateFuelLog, recordFuelPurchase);
router.get('/logs/vehicle/:vehicle_id', authorize('fleet_officer'), validateIdParam, getFuelLogs);
router.get('/efficiency/:vehicle_id', authorize('fleet_officer'), validateIdParam, getFuelEfficiency);

// Report routes (accessible by fleet officer and admin)
router.get('/report', authorize('fleet_officer', 'university_admin'), reportLimiter, validateDateRange, getFuelReport);

module.exports = router;