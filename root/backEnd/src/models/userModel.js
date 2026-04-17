const pool = require('../config/database');

const UserModel = {
    // Find user by email
    findByEmail: async (email) => {
        const [users] = await pool.query(
            `SELECT u.*, r.role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.role_id 
             WHERE u.email = ?`,
            [email]
        );
        return users[0];
    },

    // Find user by ID
    findById: async (userId) => {
        const [users] = await pool.query(
            `SELECT u.*, r.role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.role_id 
             WHERE u.user_id = ?`,
            [userId]
        );
        return users[0];
    },

    // Get all users
    findAll: async (filters = {}) => {
        let query = `
            SELECT u.user_id, u.email, u.full_name, u.phone, u.is_active, u.created_at, u.last_login,
                   r.role_id, r.role_name
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            WHERE 1=1
        `;
        const params = [];

        if (filters.role_id) {
            query += ` AND u.role_id = ?`;
            params.push(filters.role_id);
        }
        if (filters.is_active !== undefined) {
            query += ` AND u.is_active = ?`;
            params.push(filters.is_active);
        }

        query += ` ORDER BY u.created_at DESC`;
        
        const [users] = await pool.query(query, params);
        return users;
    },

    // Create new user
    create: async (userData) => {
        const { email, password_hash, full_name, phone, role_id } = userData;
        const [result] = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, phone, role_id, is_active)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [email, password_hash, full_name, phone, role_id]
        );
        return result.insertId;
    },

    // Update user
    update: async (userId, userData) => {
        const { full_name, phone, role_id, is_active } = userData;
        const [result] = await pool.query(
            `UPDATE users 
             SET full_name = ?, phone = ?, role_id = ?, is_active = ?
             WHERE user_id = ?`,
            [full_name, phone, role_id, is_active, userId]
        );
        return result.affectedRows;
    },

    // Update last login
    updateLastLogin: async (userId) => {
        const [result] = await pool.query(
            `UPDATE users SET last_login = NOW() WHERE user_id = ?`,
            [userId]
        );
        return result.affectedRows;
    },

    // Update password
    updatePassword: async (userId, passwordHash) => {
        const [result] = await pool.query(
            `UPDATE users SET password_hash = ? WHERE user_id = ?`,
            [passwordHash, userId]
        );
        return result.affectedRows;
    },

    // Delete (deactivate) user
    delete: async (userId) => {
        const [result] = await pool.query(
            `UPDATE users SET is_active = 0 WHERE user_id = ?`,
            [userId]
        );
        return result.affectedRows;
    },

    // Activate user
    activate: async (userId) => {
        const [result] = await pool.query(
            `UPDATE users SET is_active = 1 WHERE user_id = ?`,
            [userId]
        );
        return result.affectedRows;
    },

    // Get user count by role
    getCountByRole: async (roleId) => {
        const [result] = await pool.query(
            `SELECT COUNT(*) as count FROM users WHERE role_id = ? AND is_active = 1`,
            [roleId]
        );
        return result[0].count;
    },

    // Search users
    search: async (keyword) => {
        const [users] = await pool.query(
            `SELECT u.user_id, u.email, u.full_name, u.phone, u.is_active,
                    r.role_name
             FROM users u
             JOIN roles r ON u.role_id = r.role_id
             WHERE u.full_name LIKE ? OR u.email LIKE ?
             LIMIT 20`,
            [`%${keyword}%`, `%${keyword}%`]
        );
        return users;
    }
};

module.exports = UserModel;