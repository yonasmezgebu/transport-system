const express = require('express');
const {
    getTodaySchedule,
    getScheduleByDate,
    recordEntry,
    recordExit,
    verifyVehicle,
    getGateLogs
} = require('../controllers/gateController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateIdParam } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All gate routes require authentication and gate guard role
router.use(authenticate);
router.use(authorize('gate_guard'));

router.get('/schedule/today', getTodaySchedule);
router.get('/schedule/:date', getScheduleByDate);
router.post('/entry/:trip_id', apiLimiter, validateIdParam, recordEntry);
router.post('/exit/:trip_id', apiLimiter, validateIdParam, recordExit);
router.get('/verify/:registration_number', verifyVehicle);
router.get('/logs', getGateLogs);

module.exports = router;