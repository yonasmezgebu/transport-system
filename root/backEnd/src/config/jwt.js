const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
    const payload = {
        user_id: user.user_id,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Generate refresh token (for future implementation)
const generateRefreshToken = (user) => {
    const payload = {
        user_id: user.user_id,
        email: user.email
    };

    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, decoded };
    } catch (error) {
        let message = 'Invalid token';
        if (error.name === 'TokenExpiredError') {
            message = 'Token expired';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token signature';
        }
        return { valid: false, error: message };
    }
};

// Decode token without verification
const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};

// Blacklist token (for logout)
const tokenBlacklist = new Set();

const blacklistToken = (token) => {
    const decoded = decodeToken(token);
    if (decoded && decoded.exp) {
        tokenBlacklist.add(token);
        // Auto remove after expiry
        const expiryTime = (decoded.exp * 1000) - Date.now();
        setTimeout(() => {
            tokenBlacklist.delete(token);
        }, expiryTime);
    }
};

const isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    decodeToken,
    blacklistToken,
    isTokenBlacklisted
};