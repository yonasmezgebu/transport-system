const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../config/mail');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT u.user_id, u.email, u.full_name, u.phone, u.is_active, u.created_at, u.last_login,
                   r.role_id, r.role_name
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            ORDER BY u.created_at DESC
        `);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await pool.query(`
            SELECT u.user_id, u.email, u.full_name, u.phone, u.is_active, u.created_at, u.last_login,
                   r.role_id, r.role_name
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            WHERE u.user_id = ?
        `, [id]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

const createUser = async (req, res) => {
    try {
        const { email, full_name, phone, role_id, password } = req.body;
        
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password || 'Default@123', 10);
        
        const [result] = await pool.query(`
            INSERT INTO users (email, password_hash, full_name, phone, role_id, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        `, [email, hashedPassword, full_name, phone, role_id]);
        
        await sendWelcomeEmail(email, full_name, 'User');
        
        res.status(201).json({ message: 'User created successfully', user_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, phone, role_id, is_active } = req.body;
        
        await pool.query(`
            UPDATE users 
            SET full_name = ?, phone = ?, role_id = ?, is_active = ?
            WHERE user_id = ?
        `, [full_name, phone, role_id, is_active, id]);
        
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE users SET is_active = 0 WHERE user_id = ?', [id]);
        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
        
        const [users] = await pool.query('SELECT password_hash FROM users WHERE user_id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const isValid = await bcrypt.compare(oldPassword, users[0].password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, id]);
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// ========== NEW FUNCTION: UPDATE PROFILE (for authenticated user) ==========
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id; // Get from authenticated user
        const { full_name, phone } = req.body;
        
        // Update user profile
        await pool.query(
            `UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?`,
            [full_name, phone, userId]
        );
        
        // Get updated user with role
        const [users] = await pool.query(
            `SELECT u.user_id, u.email, u.full_name, u.phone, u.role_id, r.role_name
             FROM users u
             JOIN roles r ON u.role_id = r.role_id
             WHERE u.user_id = ?`,
            [userId]
        );
        
        res.json({ 
            message: 'Profile updated successfully',
            user: users[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

module.exports = { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    changePassword,
    updateProfile  // Added this
};