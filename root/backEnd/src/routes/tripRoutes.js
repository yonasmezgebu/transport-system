const express = require('express');
const {
    getAllTrips,
    getTripById,
    createTrip,
    updateTrip,
    updateTripStatus,
    cancelTrip
} = require('../controllers/tripController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateTrip, validateIdParam } = require('../middleware/validation');
const { tripCreationLimiter, apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes (authenticated users)
router.get('/', authenticate, getAllTrips);
router.get('/:id', authenticate, validateIdParam, getTripById);

// Transport manager only routes
router.post('/', authenticate, authorize('transport_manager'), tripCreationLimiter, validateTrip, createTrip);
router.put('/:id', authenticate, authorize('transport_manager'), validateIdParam, updateTrip);
router.put('/:id/status', authenticate, authorize('transport_manager', 'driver'), validateIdParam, updateTripStatus);
router.delete('/:id', authenticate, authorize('transport_manager'), validateIdParam, cancelTrip);

module.exports = router;