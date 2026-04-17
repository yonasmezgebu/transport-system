const express = require('express');
const { 
    login, 
    getCurrentUser, 
    logout, 
    resetPassword, 
    confirmReset,
    refreshToken,
    initiateTwoFactor,
    verifyTwoFactor,
    changePassword,
    forgotPassword
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginLimiter, resetLimiter } = require('../middleware/rateLimiter');
const { validateLogin } = require('../middleware/validation');

const router = express.Router();

// Existing routes
router.post('/login', loginLimiter, validateLogin, login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.post('/reset-password', resetLimiter, resetPassword);
router.post('/reset-password/confirm', resetLimiter, confirmReset);

// ========== NEW ROUTES ==========

// Token refresh
router.post('/refresh-token', refreshToken);

// Two-Factor Authentication
router.post('/2fa/initiate', initiateTwoFactor);
router.post('/2fa/verify', verifyTwoFactor);

// Password management
router.post('/change-password', authenticate, changePassword);
router.post('/forgot-password', resetLimiter, forgotPassword);
router.post('/reset-password', resetLimiter, resetPassword);

module.exports = router;