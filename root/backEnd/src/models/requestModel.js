const pool = require('../config/database');

const RequestModel = {
    // Find request by ID
    findById: async (requestId) => {
        const [requests] = await pool.query(
            `SELECT r.*, u.full_name as requester_name, u.email as requester_email, u.department
             FROM department_requests r
             JOIN users u ON r.department_head_id = u.user_id
             WHERE r.request_id = ?`,
            [requestId]
        );
        return requests[0];
    },

    // Get all requests
    findAll: async (filters = {}) => {
        let query = `
            SELECT r.*, u.full_name as requester_name, u.email as requester_email
            FROM department_requests r
            JOIN users u ON r.department_head_id = u.user_id
            WHERE 1=1
        `;
        const params = [];

        if (filters.status) {
            query += ` AND r.status = ?`;
            params.push(filters.status);
        }
        if (filters.department_head_id) {
            query += ` AND r.department_head_id = ?`;
            params.push(filters.department_head_id);
        }
        if (filters.start_date) {
            query += ` AND r.requested_date >= ?`;
            params.push(filters.start_date);
        }
        if (filters.end_date) {
            query += ` AND r.requested_date <= ?`;
            params.push(filters.end_date);
        }

        query += ` ORDER BY r.created_at DESC`;
        
        const [requests] = await pool.query(query, params);
        return requests;
    },

    // Create request
    create: async (requestData) => {
        const { department_head_id, purpose, requested_date, requested_time, passenger_count, destination, status } = requestData;
        const [result] = await pool.query(
            `INSERT INTO department_requests (department_head_id, purpose, requested_date, requested_time, passenger_count, destination, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [department_head_id, purpose, requested_date, requested_time, passenger_count, destination, status || 'pending']
        );
        return result.insertId;
    },

    // Update request status
    updateStatus: async (requestId, status, rejectionReason = null) => {
        let query = `UPDATE department_requests SET status = ?, updated_at = NOW()`;
        const params = [status];

        if (rejectionReason) {
            query += `, rejection_reason = ?`;
            params.push(rejectionReason);
        }

        query += ` WHERE request_id = ?`;
        params.push(requestId);

        const [result] = await pool.query(query, params);
        return result.affectedRows;
    },

    // Get requests by department head
    findByDepartmentHead: async (departmentHeadId) => {
        const [requests] = await pool.query(
            `SELECT * FROM department_requests
             WHERE department_head_id = ?
             ORDER BY created_at DESC`,
            [departmentHeadId]
        );
        return requests;
    },

    // Get pending requests
    getPending: async () => {
        const [requests] = await pool.query(
            `SELECT r.*, u.full_name as requester_name, u.email as requester_email
             FROM department_requests r
             JOIN users u ON r.department_head_id = u.user_id
             WHERE r.status = 'pending'
             ORDER BY r.created_at ASC`
        );
        return requests;
    },

    // Get request count by status
    getCountByStatus: async () => {
        const [counts] = await pool.query(
            `SELECT status, COUNT(*) as count
             FROM department_requests
             GROUP BY status`
        );
        return counts;
    },

    // Approve request
    approve: async (requestId, approvedBy) => {
        const [result] = await pool.query(
            `UPDATE department_requests 
             SET status = 'approved', updated_at = NOW()
             WHERE request_id = ?`,
            [requestId]
        );
        return result.affectedRows;
    },

    // Reject request
    reject: async (requestId, reason, rejectedBy) => {
        const [result] = await pool.query(
            `UPDATE department_requests 
             SET status = 'rejected', rejection_reason = ?, updated_at = NOW()
             WHERE request_id = ?`,
            [reason, requestId]
        );
        return result.affectedRows;
    }
};

module.exports = RequestModel;