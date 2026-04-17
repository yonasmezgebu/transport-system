const express = require('express');
const {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    getDriverHours,
    getDriverIncidents
} = require('../controllers/driverController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateDriver, validateIdParam } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Authenticated routes
router.use(authenticate);

// Driver specific routes (accessible by driver themselves)
router.get('/:id/hours', validateIdParam, getDriverHours);
router.get('/:id/incidents', validateIdParam, getDriverIncidents);

// Transport manager only routes
router.get('/', authorize('transport_manager'), getAllDrivers);
router.get('/:id', authorize('transport_manager'), validateIdParam, getDriverById);
router.post('/', authorize('transport_manager'), apiLimiter, validateDriver, createDriver);
router.put('/:id', authorize('transport_manager'), validateIdParam, updateDriver);
router.delete('/:id', authorize('transport_manager'), validateIdParam, deleteDriver);

module.exports = router;