const pool = require('../config/database');

const TripModel = {
    // Find trip by ID
    findById: async (tripId) => {
        const [trips] = await pool.query(
            `SELECT t.*, 
                    d.driver_id, u.full_name as driver_name,
                    v.vehicle_id, v.registration_number, v.model, v.capacity
             FROM trips t
             LEFT JOIN trip_assignments ta ON t.trip_id = ta.trip_id
             LEFT JOIN drivers d ON ta.driver_id = d.driver_id
             LEFT JOIN users u ON d.user_id = u.user_id
             LEFT JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
             WHERE t.trip_id = ?`,
            [tripId]
        );
        return trips[0];
    },

    // Get all trips with filters
    findAll: async (filters = {}) => {
        let query = `
            SELECT t.*, 
                   d.driver_id, u.full_name as driver_name,
                   v.vehicle_id, v.registration_number, v.model
            FROM trips t
            LEFT JOIN trip_assignments ta ON t.trip_id = ta.trip_id
            LEFT JOIN drivers d ON ta.driver_id = d.driver_id
            LEFT JOIN users u ON d.user_id = u.user_id
            LEFT JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
            WHERE 1=1
        `;
        const params = [];

        if (filters.date) {
            query += ` AND t.trip_date = ?`;
            params.push(filters.date);
        }
        if (filters.route) {
            query += ` AND t.route LIKE ?`;
            params.push(`%${filters.route}%`);
        }
        if (filters.status) {
            query += ` AND t.status = ?`;
            params.push(filters.status);
        }
        if (filters.driver_id) {
            query += ` AND d.driver_id = ?`;
            params.push(filters.driver_id);
        }
        if (filters.vehicle_id) {
            query += ` AND v.vehicle_id = ?`;
            params.push(filters.vehicle_id);
        }

        query += ` ORDER BY t.trip_date, t.trip_time`;
        
        const [trips] = await pool.query(query, params);
        return trips;
    },

    // Create trip
    create: async (tripData) => {
        const { trip_date, trip_time, route, purpose, category, expected_passenger_count, created_by, status } = tripData;
        const [result] = await pool.query(
            `INSERT INTO trips (trip_date, trip_time, route, purpose, category, expected_passenger_count, created_by, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [trip_date, trip_time, route, purpose, category, expected_passenger_count, created_by, status || 'scheduled']
        );
        return result.insertId;
    },

    // Update trip
    update: async (tripId, tripData) => {
        const { trip_date, trip_time, route, purpose, category, expected_passenger_count, status } = tripData;
        const [result] = await pool.query(
            `UPDATE trips 
             SET trip_date = ?, trip_time = ?, route = ?, purpose = ?, category = ?, expected_passenger_count = ?, status = ?
             WHERE trip_id = ?`,
            [trip_date, trip_time, route, purpose, category, expected_passenger_count, status, tripId]
        );
        return result.affectedRows;
    },

    // Update trip status
    updateStatus: async (tripId, status) => {
        const [result] = await pool.query(
            `UPDATE trips SET status = ? WHERE trip_id = ?`,
            [status, tripId]
        );
        return result.affectedRows;
    },

    // Delete (cancel) trip
    delete: async (tripId) => {
        const [result] = await pool.query(
            `UPDATE trips SET status = 'cancelled' WHERE trip_id = ?`,
            [tripId]
        );
        return result.affectedRows;
    },

    // Assign driver and vehicle to trip
    assignDriverAndVehicle: async (tripId, driverId, vehicleId) => {
        const [result] = await pool.query(
            `INSERT INTO trip_assignments (trip_id, driver_id, vehicle_id)
             VALUES (?, ?, ?)`,
            [tripId, driverId, vehicleId]
        );
        return result.insertId;
    },

    // Get trips by driver
    findByDriver: async (driverId, date = null) => {
        let query = `
            SELECT t.*, v.registration_number, v.model
            FROM trips t
            JOIN trip_assignments ta ON t.trip_id = ta.trip_id
            JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
            WHERE ta.driver_id = ?
        `;
        const params = [driverId];

        if (date) {
            query += ` AND t.trip_date = ?`;
            params.push(date);
        }

        query += ` ORDER BY t.trip_date, t.trip_time`;
        
        const [trips] = await pool.query(query, params);
        return trips;
    },

    // Get trips by vehicle
    findByVehicle: async (vehicleId, date = null) => {
        let query = `
            SELECT t.*, u.full_name as driver_name
            FROM trips t
            JOIN trip_assignments ta ON t.trip_id = ta.trip_id
            JOIN drivers d ON ta.driver_id = d.driver_id
            JOIN users u ON d.user_id = u.user_id
            WHERE ta.vehicle_id = ?
        `;
        const params = [vehicleId];

        if (date) {
            query += ` AND t.trip_date = ?`;
            params.push(date);
        }

        query += ` ORDER BY t.trip_date, t.trip_time`;
        
        const [trips] = await pool.query(query, params);
        return trips;
    },

    // Get daily schedule
    getDailySchedule: async (date) => {
        const [trips] = await pool.query(
            `SELECT t.*, 
                    u.full_name as driver_name,
                    v.registration_number, v.model
             FROM trips t
             LEFT JOIN trip_assignments ta ON t.trip_id = ta.trip_id
             LEFT JOIN drivers d ON ta.driver_id = d.driver_id
             LEFT JOIN users u ON d.user_id = u.user_id
             LEFT JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
             WHERE t.trip_date = ?
             ORDER BY t.trip_time`,
            [date]
        );
        return trips;
    },

    // Check driver availability
    checkDriverAvailability: async (driverId, date, time) => {
        const [conflicts] = await pool.query(
            `SELECT * FROM trip_assignments ta
             JOIN trips t ON ta.trip_id = t.trip_id
             WHERE ta.driver_id = ? 
             AND t.trip_date = ?
             AND ABS(TIMEDIFF(t.trip_time, ?)) < 3600
             AND t.status != 'cancelled'`,
            [driverId, date, time]
        );
        return conflicts.length === 0;
    },

    // Check vehicle availability
    checkVehicleAvailability: async (vehicleId, date, time) => {
        const [conflicts] = await pool.query(
            `SELECT * FROM trip_assignments ta
             JOIN trips t ON ta.trip_id = t.trip_id
             WHERE ta.vehicle_id = ? 
             AND t.trip_date = ?
             AND ABS(TIMEDIFF(t.trip_time, ?)) < 3600
             AND t.status != 'cancelled'`,
            [vehicleId, date, time]
        );
        return conflicts.length === 0;
    },

    // Get trip count by date range
    getCountByDateRange: async (startDate, endDate) => {
        const [result] = await pool.query(
            `SELECT COUNT(*) as count, 
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
             FROM trips
             WHERE trip_date BETWEEN ? AND ?`,
            [startDate, endDate]
        );
        return result[0];
    }
};

module.exports = TripModel;