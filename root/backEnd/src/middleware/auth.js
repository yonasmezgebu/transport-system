const { verifyToken, isTokenBlacklisted } = require('../config/jwt');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
        return res.status(401).json({ error: 'Token has been invalidated' });
    }
    
    const { valid, decoded, error } = verifyToken(token);
    
    if (!valid) {
        return res.status(401).json({ error: error || 'Invalid or expired token' });
    }
    
    const [users] = await pool.query(
        `SELECT u.*, r.role_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.role_id 
         WHERE u.user_id = ? AND u.is_active = 1`,
        [decoded.user_id]
    );
    
    if (users.length === 0) {
        return res.status(401).json({ error: 'User not found or inactive' });
    }
    
    req.user = users[0];
    req.token = token;
    next();
};

const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    
    const token = authHeader.split(' ')[1];
    const { valid, decoded } = verifyToken(token);
    
    if (valid && !isTokenBlacklisted(token)) {
        const [users] = await pool.query(
            `SELECT u.*, r.role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.role_id 
             WHERE u.user_id = ? AND u.is_active = 1`,
            [decoded.user_id]
        );
        if (users.length > 0) {
            req.user = users[0];
        }
    }
    
    next();
};

// AUTHORIZE FUNCTION - FIXED: This is the missing function
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        if (!allowedRoles.includes(req.user.role_name)) {
            return res.status(403).json({ 
                error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
                your_role: req.user.role_name
            });
        }
        
        next();
    };
};

module.exports = { 
    authenticate, 
    optionalAuth, 
    authorize  // Make sure authorize is exported
};