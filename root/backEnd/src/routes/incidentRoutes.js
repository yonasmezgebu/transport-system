const express = require('express');
const {
    createIncident,
    submitIncident,
    getIncidents,
    getIncidentById,
    uploadPhoto,
    getIncidentReport
} = require('../controllers/incidentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateIncident, validateIdParam, validateDateRange } = require('../middleware/validation');
const { uploadIncidentPhoto } = require('../middleware/upload');
const { apiLimiter, uploadLimiter, reportLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Driver routes
router.post('/', authorize('driver'), apiLimiter, validateIncident, createIncident);
router.put('/:id/submit', authorize('driver'), validateIdParam, submitIncident);
router.post('/:id/photos', authorize('driver'), uploadLimiter, uploadIncidentPhoto.single('photo'), uploadPhoto);

// View routes (accessible by drivers for their own, managers for all)
router.get('/', authorize('driver', 'transport_manager'), getIncidents);
router.get('/:id', authorize('driver', 'transport_manager'), validateIdParam, getIncidentById);

// Report routes (manager only)
router.get('/report', authorize('transport_manager'), reportLimiter, validateDateRange, getIncidentReport);

module.exports = router;