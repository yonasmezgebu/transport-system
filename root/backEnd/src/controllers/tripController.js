const pool = require('../config/database');

const getAllTrips = async (req, res) => {
    try {
        const { date, route, status } = req.query;
        let query = `
            SELECT t.*, 
                   d.driver_id, u.full_name as driver_name,
                   v.vehicle_id, v.registration_number, v.model, v.capacity
            FROM trips t
            LEFT JOIN trip_assignments ta ON t.trip_id = ta.trip_id
            LEFT JOIN drivers d ON ta.driver_id = d.driver_id
            LEFT JOIN users u ON d.user_id = u.user_id
            LEFT JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
            WHERE 1=1
        `;
        const params = [];
        
        if (date) {
            query += ` AND t.trip_date = ?`;
            params.push(date);
        }
        if (route) {
            query += ` AND t.route LIKE ?`;
            params.push(`%${route}%`);
        }
        if (status) {
            query += ` AND t.status = ?`;
            params.push(status);
        }
        
        if (req.user.role_name === 'driver') {
            query += ` AND d.user_id = ?`;
            params.push(req.user.user_id);
        }
        
        query += ` ORDER BY t.trip_date, t.trip_time`;
        
        const [trips] = await pool.query(query, params);
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

const getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const [trips] = await pool.query(`
            SELECT t.*, 
                   d.driver_id, u.full_name as driver_name, d.license_number,
                   v.vehicle_id, v.registration_number, v.model, v.capacity
            FROM trips t
            LEFT JOIN trip_assignments ta ON t.trip_id = ta.trip_id
            LEFT JOIN drivers d ON ta.driver_id = d.driver_id
            LEFT JOIN users u ON d.user_id = u.user_id
            LEFT JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
            WHERE t.trip_id = ?
        `, [id]);
        
        if (trips.length === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        
        res.json(trips[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trip' });
    }
};

const createTrip = async (req, res) => {
    try {
        const { trip_date, trip_time, route, purpose, category, expected_passenger_count, driver_id, vehicle_id } = req.body;
        
        // Check driver availability
        const [driverConflicts] = await pool.query(`
            SELECT * FROM trip_assignments ta
            JOIN trips t ON ta.trip_id = t.trip_id
            WHERE ta.driver_id = ? 
            AND t.trip_date = ?
            AND ABS(TIMEDIFF(t.trip_time, ?)) < 3600
            AND t.status != 'cancelled'
        `, [driver_id, trip_date, trip_time]);
        
        if (driverConflicts.length > 0) {
            return res.status(409).json({ error: 'Driver is already assigned to another trip at this time' });
        }
        
        // Check vehicle availability
        const [vehicleConflicts] = await pool.query(`
            SELECT * FROM trip_assignments ta
            JOIN trips t ON ta.trip_id = t.trip_id
            WHERE ta.vehicle_id = ? 
            AND t.trip_date = ?
            AND ABS(TIMEDIFF(t.trip_time, ?)) < 3600
            AND t.status != 'cancelled'
        `, [vehicle_id, trip_date, trip_time]);
        
        if (vehicleConflicts.length > 0) {
            return res.status(409).json({ error: 'Vehicle is already assigned to another trip at this time' });
        }
        
        // Check vehicle capacity
        const [vehicle] = await pool.query('SELECT capacity FROM vehicles WHERE vehicle_id = ?', [vehicle_id]);
        if (vehicle[0].capacity < expected_passenger_count) {
            return res.status(400).json({ error: 'Vehicle capacity insufficient' });
        }
        
        // Check driver hours
        const [hours] = await pool.query(`
            SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, t.trip_time, ADDTIME(t.trip_time, '02:00:00'))), 0) as weekly_hours
            FROM trip_assignments ta
            JOIN trips t ON ta.trip_id = t.trip_id
            WHERE ta.driver_id = ? 
            AND t.trip_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
            AND t.status != 'cancelled'
        `, [driver_id]);
        
        if (hours[0].weekly_hours + 2 > 48) {
            return res.status(409).json({ error: 'Driver would exceed weekly hour limit (48 hours)' });
        }
        
        // Create trip
        const [result] = await pool.query(`
            INSERT INTO trips (trip_date, trip_time, route, purpose, category, expected_passenger_count, created_by, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')
        `, [trip_date, trip_time, route, purpose, category, expected_passenger_count, req.user.user_id]);
        
        const trip_id = result.insertId;
        
        // Create assignment
        await pool.query(`
            INSERT INTO trip_assignments (trip_id, driver_id, vehicle_id)
            VALUES (?, ?, ?)
        `, [trip_id, driver_id, vehicle_id]);
        
        // Audit log
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, ip_address)
            VALUES (?, 'CREATE_TRIP', 'trip', ?, ?, ?)
        `, [req.user.user_id, trip_id, JSON.stringify(req.body), req.ip]);
        
        res.status(201).json({ message: 'Trip created successfully', trip_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
};

const updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const { trip_date, trip_time, route, purpose, category, expected_passenger_count, driver_id, vehicle_id } = req.body;
        
        await pool.query(`
            UPDATE trips 
            SET trip_date = ?, trip_time = ?, route = ?, purpose = ?, category = ?, expected_passenger_count = ?
            WHERE trip_id = ?
        `, [trip_date, trip_time, route, purpose, category, expected_passenger_count, id]);
        
        await pool.query(`
            UPDATE trip_assignments 
            SET driver_id = ?, vehicle_id = ?
            WHERE trip_id = ?
        `, [driver_id, vehicle_id, id]);
        
        res.json({ message: 'Trip updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update trip' });
    }
};

const updateTripStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await pool.query('UPDATE trips SET status = ? WHERE trip_id = ?', [status, id]);
        
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, ip_address)
            VALUES (?, 'UPDATE_TRIP_STATUS', 'trip', ?, ?, ?)
        `, [req.user.user_id, id, JSON.stringify({ status }), req.ip]);
        
        res.json({ message: 'Trip status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update trip status' });
    }
};

const cancelTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        await pool.query('UPDATE trips SET status = ? WHERE trip_id = ?', ['cancelled', id]);
        
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, ip_address)
            VALUES (?, 'CANCEL_TRIP', 'trip', ?, ?, ?)
        `, [req.user.user_id, id, JSON.stringify({ reason }), req.ip]);
        
        res.json({ message: 'Trip cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel trip' });
    }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, updateTripStatus, cancelTrip };