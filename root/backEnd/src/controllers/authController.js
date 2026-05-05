const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { generateToken, verifyToken, blacklistToken } = require('../config/jwt');
const { sendResetPasswordEmail, sendTwoFactorCode } = require('../config/mail');
const crypto = require('crypto');

// ========== LOGIN FUNCTION ==========
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        const [users] = await pool.execute(
            `SELECT u.*, r.role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.role_id 
             WHERE u.email = ? AND u.is_active = 1`,
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        await pool.execute('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);
        
        const token = generateToken({
            user_id: user.user_id,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name
        });
        
        res.json({
            success: true,
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                phone: user.phone,
                role_id: user.role_id,
                role_name: user.role_name
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// ========== GET CURRENT USER ==========
const getCurrentUser = async (req, res) => {
    try {
        res.json({
            user: {
                user_id: req.user.user_id,
                email: req.user.email,
                full_name: req.user.full_name,
                phone: req.user.phone,
                role_id: req.user.role_id,
                role_name: req.user.role_name
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
};

// ========== LOGOUT ==========
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            blacklistToken(token);
        }
        
        await pool.execute(
            'INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
            [req.user.user_id, 'LOGOUT', req.ip]
        );
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
};

// ========== RESET PASSWORD ==========
const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = users[0];
        const resetToken = generateToken({ user_id: user.user_id, email: user.email });
        
        await sendResetPasswordEmail(user.email, user.full_name, resetToken);
        
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send reset email' });
    }
};

// ========== CONFIRM RESET ==========
const confirmReset = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        const { valid, decoded } = verifyToken(token);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, decoded.user_id]);
        
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

// ========== REFRESH TOKEN ==========
const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const oldToken = authHeader.split(' ')[1];
        const { valid, decoded } = verifyToken(oldToken);
        
        if (!valid) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        const newToken = generateToken({
            user_id: decoded.user_id,
            email: decoded.email,
            role_id: decoded.role_id,
            role_name: decoded.role_name
        });
        
        blacklistToken(oldToken);
        
        res.json({ token: newToken });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

// ========== INITIATE TWO-FACTOR AUTH ==========
const initiateTwoFactor = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await pool.execute(
            `SELECT u.*, r.role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.role_id 
             WHERE u.email = ? AND u.is_active = 1`,
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const twoFactorCode = crypto.randomInt(100000, 999999).toString();
        const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        await pool.execute(
            `UPDATE users SET two_factor_code = ?, two_factor_expiry = ? WHERE user_id = ?`,
            [twoFactorCode, codeExpiry, user.user_id]
        );
        
        await sendTwoFactorCode(user.email, user.full_name, twoFactorCode);
        
        res.json({ 
            requiresTwoFactor: true, 
            message: 'Verification code sent to your email',
            userId: user.user_id
        });
    } catch (error) {
        console.error('2FA initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate 2FA' });
    }
};

// ========== VERIFY TWO-FACTOR CODE ==========
const verifyTwoFactor = async (req, res) => {
    try {
        const { email, password, code } = req.body;
        
        const [users] = await pool.execute(
            `SELECT * FROM users WHERE email = ? AND is_active = 1`,
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        if (user.two_factor_code !== code || new Date(user.two_factor_expiry) < new Date()) {
            return res.status(401).json({ error: 'Invalid or expired verification code' });
        }
        
        await pool.execute(
            `UPDATE users SET two_factor_code = NULL, two_factor_expiry = NULL WHERE user_id = ?`,
            [user.user_id]
        );
        
        const [roles] = await pool.execute(`SELECT role_name FROM roles WHERE role_id = ?`, [user.role_id]);
        
        const token = generateToken({
            user_id: user.user_id,
            email: user.email,
            role_id: user.role_id,
            role_name: roles[0].role_name
        });
        
        await pool.execute('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);
        
        res.json({
            success: true,
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                phone: user.phone,
                role_id: user.role_id,
                role_name: roles[0].role_name
            }
        });
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ error: 'Failed to verify 2FA code' });
    }
};

// ========== CHANGE PASSWORD ==========
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.user_id;
        
        const [users] = await pool.execute(`SELECT password_hash FROM users WHERE user_id = ?`, [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const isValid = await bcrypt.compare(oldPassword, users[0].password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute(`UPDATE users SET password_hash = ? WHERE user_id = ?`, [hashedPassword, userId]);
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// ========== FORGOT PASSWORD ==========
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const [users] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [email]);
        
        if (users.length === 0) {
            return res.json({ message: 'If your email is registered, you will receive a reset link' });
        }
        
        const user = users[0];
        const resetToken = generateToken({ 
            user_id: user.user_id, 
            email: user.email,
            purpose: 'password_reset'
        });
        
        await pool.execute(
            `UPDATE users SET reset_token = ?, reset_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE user_id = ?`,
            [resetToken, user.user_id]
        );
        
        await sendResetPasswordEmail(user.email, user.full_name, resetToken);
        
        res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to send reset link' });
    }
};

// ========== REGISTER STAFF ==========
const registerStaff = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;
        
        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Check if user already exists
        const [existing] = await pool.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }
        
        // Get staff role id
        const [roles] = await pool.execute('SELECT role_id FROM roles WHERE role_name = ?', ['staff']);
        if (roles.length === 0) {
            return res.status(500).json({ error: 'Staff role not configured in the system' });
        }
        const staffRoleId = roles[0].role_id;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.execute(
            `INSERT INTO users (email, password_hash, full_name, phone, role_id, is_active)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [email, hashedPassword, full_name, phone, staffRoleId]
        );
        
        res.status(201).json({ success: true, message: 'Staff registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// ========== EXPORT ALL FUNCTIONS ==========
module.exports = { 
    login,           // ✅ Defined
    getCurrentUser,  // ✅ Defined
    logout,          // ✅ Defined
    resetPassword,   // ✅ Defined
    confirmReset,    // ✅ Defined
    refreshToken,    // ✅ Defined
    initiateTwoFactor, // ✅ Defined
    verifyTwoFactor, // ✅ Defined
    changePassword,  // ✅ Defined
    forgotPassword,   // ✅ Defined
    registerStaff    // ✅ Defined
};
