const express = require('express');
const {
    getOperationalReport,
    getFinancialReport,
    getDriverPerformanceReport,
    getVehicleUtilizationReport
} = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateDateRange } = require('../middleware/validation');
const { reportLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All report routes require authentication and admin/manager role
router.use(authenticate);
router.use(authorize('transport_manager', 'fleet_officer', 'university_admin'));

router.get('/operational', reportLimiter, validateDateRange, getOperationalReport);
router.get('/financial', reportLimiter, validateDateRange, getFinancialReport);
router.get('/drivers', reportLimiter, validateDateRange, getDriverPerformanceReport);
router.get('/vehicles', reportLimiter, validateDateRange, getVehicleUtilizationReport);

module.exports = router;