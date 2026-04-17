const express = require('express');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    updateProfile  // NEW: Add this import
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateUser, validateIdParam } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public profile route (authenticated users can update their own profile)
router.put('/profile', authenticate, updateProfile);  // NEW: Add this line

// Admin only routes
router.use(authenticate);
router.use(authorize('university_admin', 'transport_manager'));

router.get('/', getAllUsers);
router.get('/:id', validateIdParam, getUserById);
router.post('/', apiLimiter, validateUser, createUser);
router.put('/:id', validateIdParam, updateUser);
router.delete('/:id', validateIdParam, deleteUser);
router.post('/:id/change-password', validateIdParam, changePassword);

module.exports = router;