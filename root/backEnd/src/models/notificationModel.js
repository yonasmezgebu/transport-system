const pool = require('../config/database');

const NotificationModel = {
    // Find notification by ID
    findById: async (notificationId) => {
        const [notifications] = await pool.query(
            `SELECT * FROM notifications WHERE notification_id = ?`,
            [notificationId]
        );
        return notifications[0];
    },

    // Get notifications by user
    findByUser: async (userId, limit = 50, offset = 0) => {
        const [notifications] = await pool.query(
            `SELECT * FROM notifications
             WHERE user_id = ?
             ORDER BY sent_at DESC
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );
        return notifications;
    },

    // Get unread notifications
    getUnread: async (userId) => {
        const [notifications] = await pool.query(
            `SELECT * FROM notifications
             WHERE user_id = ? AND is_read = FALSE
             ORDER BY sent_at DESC`,
            [userId]
        );
        return notifications;
    },

    // Get unread count
    getUnreadCount: async (userId) => {
        const [result] = await pool.query(
            `SELECT COUNT(*) as count
             FROM notifications
             WHERE user_id = ? AND is_read = FALSE`,
            [userId]
        );
        return result[0].count;
    },

    // Create notification
    create: async (notificationData) => {
        const { user_id, type, title, message, delivered_via_email, delivered_via_sms } = notificationData;
        const [result] = await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, delivered_via_email, delivered_via_sms)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, type, title, message, delivered_via_email || false, delivered_via_sms || false]
        );
        return result.insertId;
    },

    // Create multiple notifications (bulk)
    createBulk: async (notifications) => {
        const values = notifications.map(n => [
            n.user_id, n.type, n.title, n.message, 
            n.delivered_via_email || false, 
            n.delivered_via_sms || false
        ]);
        const [result] = await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, delivered_via_email, delivered_via_sms)
             VALUES ?`,
            [values]
        );
        return result.affectedRows;
    },

    // Mark notification as read
    markAsRead: async (notificationId, userId) => {
        const [result] = await pool.query(
            `UPDATE notifications 
             SET is_read = TRUE
             WHERE notification_id = ? AND user_id = ?`,
            [notificationId, userId]
        );
        return result.affectedRows;
    },

    // Mark all notifications as read for user
    markAllAsRead: async (userId) => {
        const [result] = await pool.query(
            `UPDATE notifications 
             SET is_read = TRUE
             WHERE user_id = ? AND is_read = FALSE`,
            [userId]
        );
        return result.affectedRows;
    },

    // Delete notification
    delete: async (notificationId, userId) => {
        const [result] = await pool.query(
            `DELETE FROM notifications
             WHERE notification_id = ? AND user_id = ?`,
            [notificationId, userId]
        );
        return result.affectedRows;
    },

    // Delete old notifications
    deleteOld: async (daysOld = 90) => {
        const [result] = await pool.query(
            `DELETE FROM notifications
             WHERE sent_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
            [daysOld]
        );
        return result.affectedRows;
    },

    // Get notifications by type
    findByType: async (userId, type) => {
        const [notifications] = await pool.query(
            `SELECT * FROM notifications
             WHERE user_id = ? AND type = ?
             ORDER BY sent_at DESC
             LIMIT 20`,
            [userId, type]
        );
        return notifications;
    },

    // Get recent notifications
    getRecent: async (userId, hours = 24) => {
        const [notifications] = await pool.query(
            `SELECT * FROM notifications
             WHERE user_id = ? 
             AND sent_at > DATE_SUB(NOW(), INTERVAL ? HOUR)
             ORDER BY sent_at DESC`,
            [userId, hours]
        );
        return notifications;
    }
};

module.exports = NotificationModel;