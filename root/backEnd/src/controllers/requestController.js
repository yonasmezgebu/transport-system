const pool = require('../config/database');
const { sendRequestApprovalNotification } = require('../config/mail');

const submitRequest = async (req, res) => {
    try {
        const { purpose, requested_date, requested_time, passenger_count, destination } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO department_requests (department_head_id, purpose, requested_date, requested_time, passenger_count, destination, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `, [req.user.user_id, purpose, requested_date, requested_time, passenger_count, destination]);
        
        res.status(201).json({ message: 'Request submitted successfully', request_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit request' });
    }
};

const getRequests = async (req, res) => {
    try {
        let query = `
            SELECT r.*, u.full_name as requester_name, u.email as requester_email
            FROM department_requests r
            JOIN users u ON r.department_head_id = u.user_id
        `;
        const params = [];
        
        if (req.user.role_name !== 'transport_manager' && req.user.role_name !== 'university_admin') {
            query += ' WHERE r.department_head_id = ?';
            params.push(req.user.user_id);
        }
        
        query += ' ORDER BY r.created_at DESC';
        
        const [requests] = await pool.query(query, params);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
};

const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const [requests] = await pool.query(`
            SELECT r.*, u.full_name as requester_name, u.email as requester_email
            FROM department_requests r
            JOIN users u ON r.department_head_id = u.user_id
            WHERE r.request_id = ?
        `, [id]);
        
        if (requests.length === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        res.json(requests[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch request' });
    }
};

const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [request] = await pool.query(`
            SELECT r.*, u.full_name, u.email 
            FROM department_requests r
            JOIN users u ON r.department_head_id = u.user_id
            WHERE r.request_id = ?
        `, [id]);
        
        await pool.query(`
            UPDATE department_requests 
            SET status = 'approved', updated_at = NOW()
            WHERE request_id = ?
        `, [id]);
        
        // Send notification
        await sendRequestApprovalNotification(
            request[0].email, 
            request[0].full_name, 
            {
                date: request[0].requested_date,
                time: request[0].requested_time,
                destination: request[0].destination,
                passengerCount: request[0].passenger_count
            },
            'approved'
        );
        
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
            VALUES (?, 'APPROVE_REQUEST', 'department_request', ?, ?)
        `, [req.user.user_id, id, req.ip]);
        
        res.json({ message: 'Request approved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve request' });
    }
};

const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejection_reason } = req.body;
        
        const [request] = await pool.query(`
            SELECT r.*, u.full_name, u.email 
            FROM department_requests r
            JOIN users u ON r.department_head_id = u.user_id
            WHERE r.request_id = ?
        `, [id]);
        
        await pool.query(`
            UPDATE department_requests 
            SET status = 'rejected', rejection_reason = ?, updated_at = NOW()
            WHERE request_id = ?
        `, [rejection_reason, id]);
        
        // Send notification
        await sendRequestApprovalNotification(
            request[0].email,
            request[0].full_name,
            {
                date: request[0].requested_date,
                time: request[0].requested_time,
                destination: request[0].destination,
                passengerCount: request[0].passenger_count
            },
            'rejected',
            rejection_reason
        );
        
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, ip_address)
            VALUES (?, 'REJECT_REQUEST', 'department_request', ?, ?, ?)
        `, [req.user.user_id, id, JSON.stringify({ rejection_reason }), req.ip]);
        
        res.json({ message: 'Request rejected' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject request' });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const [requests] = await pool.query(`
            SELECT * FROM department_requests
            WHERE department_head_id = ?
            ORDER BY created_at DESC
        `, [req.user.user_id]);
        
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your requests' });
    }
};

module.exports = { submitRequest, getRequests, getRequestById, approveRequest, rejectRequest, getMyRequests };