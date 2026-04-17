const express = require('express');
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
const { validateIdParam } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

router.get('/', getNotifications);
router.get('/unread/count', getUnreadCount);
router.put('/:id/read', validateIdParam, markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', validateIdParam, apiLimiter, deleteNotification);

module.exports = router;