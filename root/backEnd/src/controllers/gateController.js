const pool = require('../config/database');

const getTodaySchedule = async (req, res) => {
    try {
        const [schedule] = await pool.query(`
            SELECT t.trip_id, t.trip_date, t.trip_time, t.route, t.status,
                   v.vehicle_id, v.registration_number, v.model,
                   u.full_name as driver_name, u.phone as driver_phone
            FROM trips t
            JOIN trip_assignments ta ON t.trip_id = ta.trip_id
            JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
            JOIN drivers d ON ta.driver_id = d.driver_id
            JOIN users u ON d.user_id = u.user_id
            WHERE t.trip_date = CURDATE()
            ORDER BY t.trip_time
        `);
        
        res.json(schedule);
    } catch (error) {
        console.error('Get schedule error:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
};

const getScheduleByDate = async (req, res) => {
    try {
        const { date } = req.params;
        
        const [schedule] = await pool.query(`
            SELECT t.trip_id, t.trip_date, t.trip_time, t.route, t.status,
                   v.registration_number, v.model,
                   u.full_name as driver_name
            FROM trips t
            JOIN trip_assignments ta ON t.trip_id = ta.trip_id
            JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
            JOIN drivers d ON ta.driver_id = d.driver_id
            JOIN users u ON d.user_id = u.user_id
            WHERE t.trip_date = ?
            ORDER BY t.trip_time
        `, [date]);
        
        res.json(schedule);
    } catch (error) {
        console.error('Get schedule by date error:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
};

const recordEntry = async (req, res) => {
    try {
        const { trip_id } = req.params;
        
        // Check if trip exists
        const [trip] = await pool.query('SELECT * FROM trips WHERE trip_id = ?', [trip_id]);
        if (trip.length === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        
        // Check if entry already recorded today
        const [existingEntry] = await pool.query(
            `SELECT * FROM audit_logs 
             WHERE entity_type = 'trip' AND entity_id = ? AND action = 'GATE_ENTRY' AND DATE(created_at) = CURDATE()`,
            [trip_id]
        );
        
        if (existingEntry.length > 0) {
            return res.status(409).json({ error: 'Entry already recorded for this trip today' });
        }
        
        // Check if trip status allows entry
        const allowedStatuses = ['scheduled', 'delayed'];
        if (!allowedStatuses.includes(trip[0].status)) {
            return res.status(400).json({ 
                error: `Cannot record entry for trip with status: ${trip[0].status}. Allowed statuses: scheduled, delayed`
            });
        }
        
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
            VALUES (?, 'GATE_ENTRY', 'trip', ?, ?)
        `, [req.user.user_id, trip_id, req.ip]);
        
        // Update trip status to in_progress
        await pool.query('UPDATE trips SET status = ? WHERE trip_id = ?', ['in_progress', trip_id]);
        
        res.json({ 
            message: 'Entry recorded successfully', 
            time: new Date(),
            trip: trip[0]
        });
    } catch (error) {
        console.error('Record entry error:', error);
        res.status(500).json({ error: 'Failed to record entry' });
    }
};

const recordExit = async (req, res) => {
    try {
        const { trip_id } = req.params;
        
        const [trip] = await pool.query('SELECT * FROM trips WHERE trip_id = ?', [trip_id]);
        if (trip.length === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        
        // Check if exit already recorded today
        const [existingExit] = await pool.query(
            `SELECT * FROM audit_logs 
             WHERE entity_type = 'trip' AND entity_id = ? AND action = 'GATE_EXIT' AND DATE(created_at) = CURDATE()`,
            [trip_id]
        );
        
        if (existingExit.length > 0) {
            return res.status(409).json({ error: 'Exit already recorded for this trip today' });
        }
        
        // Check if trip status allows exit
        const allowedStatuses = ['in_progress', 'delayed'];
        if (!allowedStatuses.includes(trip[0].status)) {
            return res.status(400).json({ 
                error: `Cannot record exit for trip with status: ${trip[0].status}. Allowed statuses: in_progress, delayed`
            });
        }
        
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address)
            VALUES (?, 'GATE_EXIT', 'trip', ?, ?)
        `, [req.user.user_id, trip_id, req.ip]);
        
        // Update trip status to completed
        await pool.query('UPDATE trips SET status = ? WHERE trip_id = ?', ['completed', trip_id]);
        
        res.json({ 
            message: 'Exit recorded successfully', 
            time: new Date(),
            trip: trip[0]
        });
    } catch (error) {
        console.error('Record exit error:', error);
        res.status(500).json({ error: 'Failed to record exit' });
    }
};

const verifyVehicle = async (req, res) => {
    try {
        const { registration_number } = req.params;
        
        const [vehicle] = await pool.query(`
            SELECT v.*, 
                   t.trip_id, t.trip_date, t.trip_time, t.route, t.status,
                   u.full_name as driver_name
            FROM vehicles v
            LEFT JOIN trip_assignments ta ON v.vehicle_id = ta.vehicle_id
            LEFT JOIN trips t ON ta.trip_id = t.trip_id AND t.trip_date = CURDATE()
            LEFT JOIN drivers d ON ta.driver_id = d.driver_id
            LEFT JOIN users u ON d.user_id = u.user_id
            WHERE v.registration_number = ?
        `, [registration_number]);
        
        if (vehicle.length === 0) {
            return res.status(404).json({ 
                verified: false, 
                error: 'Vehicle not found in system' 
            });
        }
        
        const isAuthorized = vehicle[0].trip_id !== null;
        
        res.json({ 
            verified: isAuthorized,
            vehicle: vehicle[0],
            message: isAuthorized ? 'Vehicle verified successfully' : 'Vehicle not authorized for today'
        });
    } catch (error) {
        console.error('Verify vehicle error:', error);
        res.status(500).json({ error: 'Failed to verify vehicle' });
    }
};

const getGateLogs = async (req, res) => {
    try {
        const { date } = req.query;
        let query = `
            SELECT * FROM audit_logs
            WHERE action IN ('GATE_ENTRY', 'GATE_EXIT')
        `;
        const params = [];
        
        if (date) {
            query += ' AND DATE(created_at) = ?';
            params.push(date);
        }
        
        query += ' ORDER BY created_at DESC LIMIT 100';
        
        const [logs] = await pool.query(query, params);
        res.json(logs);
    } catch (error) {
        console.error('Get gate logs error:', error);
        res.status(500).json({ error: 'Failed to fetch gate logs' });
    }
};

module.exports = { 
    getTodaySchedule, 
    getScheduleByDate, 
    recordEntry, 
    recordExit, 
    verifyVehicle, 
    getGateLogs 
};