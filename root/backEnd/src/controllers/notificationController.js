const pool = require('../config/database');

const getNotifications = async (req, res) => {
    try {
        const [notifications] = await pool.query(`
            SELECT * FROM notifications
            WHERE user_id = ?
            ORDER BY sent_at DESC
            LIMIT 50
        `, [req.user.user_id]);
        
        const [unread] = await pool.query(`
            SELECT COUNT(*) as unread_count
            FROM notifications
            WHERE user_id = ? AND is_read = FALSE
        `, [req.user.user_id]);
        
        res.json({
            notifications,
            unread_count: unread[0].unread_count
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const [unread] = await pool.query(`
            SELECT COUNT(*) as unread_count
            FROM notifications
            WHERE user_id = ? AND is_read = FALSE
        `, [req.user.user_id]);
        
        res.json({ unread_count: unread[0].unread_count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await pool.query(`
            UPDATE notifications 
            SET is_read = TRUE
            WHERE notification_id = ? AND user_id = ?
        `, [id, req.user.user_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notification' });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await pool.query(`
            UPDATE notifications 
            SET is_read = TRUE
            WHERE user_id = ?
        `, [req.user.user_id]);
        
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notifications' });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await pool.query(`
            DELETE FROM notifications
            WHERE notification_id = ? AND user_id = ?
        `, [id, req.user.user_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};

const createNotification = async (userId, title, message, type) => {
    try {
        const [result] = await pool.query(`
            INSERT INTO notifications (user_id, type, title, message)
            VALUES (?, ?, ?, ?)
        `, [userId, type, title, message]);
        
        return result.insertId;
    } catch (error) {
        console.error('Failed to create notification:', error);
        return null;
    }
};

const sendBulkNotifications = async (userIds, title, message, type) => {
    try {
        const values = userIds.map(userId => [userId, type, title, message]);
        const [result] = await pool.query(`
            INSERT INTO notifications (user_id, type, title, message)
            VALUES ?
        `, [values]);
        
        return result.affectedRows;
    } catch (error) {
        console.error('Failed to send bulk notifications:', error);
        return 0;
    }
};

module.exports = { 
    getNotifications, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    createNotification, 
    sendBulkNotifications 
};