const express = require('express');
const {
    submitRequest,
    getRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
    getMyRequests
} = require('../controllers/requestController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest, validateIdParam } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes for staff and department heads
router.post('/', authorize('staff', 'department_head'), apiLimiter, validateRequest, submitRequest);
router.get('/my', getMyRequests);

// Routes for transport manager
router.get('/', authorize('transport_manager', 'university_admin'), getRequests);
router.get('/:id', authorize('transport_manager', 'university_admin'), validateIdParam, getRequestById);
router.put('/:id/approve', authorize('transport_manager'), validateIdParam, approveRequest);
router.put('/:id/reject', authorize('transport_manager'), validateIdParam, rejectRequest);

module.exports = router;