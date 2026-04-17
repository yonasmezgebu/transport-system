const pool = require('../config/database');

const DriverModel = {
    // Find driver by ID
    findById: async (driverId) => {
        const [drivers] = await pool.query(
            `SELECT d.*, u.full_name, u.email, u.phone, u.is_active
             FROM drivers d
             JOIN users u ON d.user_id = u.user_id
             WHERE d.driver_id = ?`,
            [driverId]
        );
        return drivers[0];
    },

    // Find driver by user ID
    findByUserId: async (userId) => {
        const [drivers] = await pool.query(
            `SELECT d.*, u.full_name, u.email, u.phone
             FROM drivers d
             JOIN users u ON d.user_id = u.user_id
             WHERE d.user_id = ?`,
            [userId]
        );
        return drivers[0];
    },

    // Get all drivers
    findAll: async (activeOnly = true) => {
        let query = `
            SELECT d.*, u.full_name, u.email, u.phone, u.is_active
            FROM drivers d
            JOIN users u ON d.user_id = u.user_id
        `;
        if (activeOnly) {
            query += ` WHERE u.is_active = 1`;
        }
        query += ` ORDER BY d.driver_id DESC`;
        
        const [drivers] = await pool.query(query);
        return drivers;
    },

    // Create driver
    create: async (driverData) => {
        const { user_id, license_number, license_expiry, hire_date } = driverData;
        const [result] = await pool.query(
            `INSERT INTO drivers (user_id, license_number, license_expiry, hire_date)
             VALUES (?, ?, ?, ?)`,
            [user_id, license_number, license_expiry, hire_date]
        );
        return result.insertId;
    },

    // Update driver
    update: async (driverId, driverData) => {
        const { license_number, license_expiry, hire_date, rating, weekly_hours } = driverData;
        const [result] = await pool.query(
            `UPDATE drivers 
             SET license_number = ?, license_expiry = ?, hire_date = ?, rating = ?, weekly_hours = ?
             WHERE driver_id = ?`,
            [license_number, license_expiry, hire_date, rating, weekly_hours, driverId]
        );
        return result.affectedRows;
    },

    // Update weekly hours
    updateWeeklyHours: async (driverId, hours) => {
        const [result] = await pool.query(
            `UPDATE drivers SET weekly_hours = ? WHERE driver_id = ?`,
            [hours, driverId]
        );
        return result.affectedRows;
    },

    // Update driver rating
    updateRating: async (driverId, rating) => {
        const [result] = await pool.query(
            `UPDATE drivers SET rating = ? WHERE driver_id = ?`,
            [rating, driverId]
        );
        return result.affectedRows;
    },

    // Calculate weekly hours
    calculateWeeklyHours: async (driverId) => {
        const [result] = await pool.query(
            `SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, t.trip_time, ADDTIME(t.trip_time, '02:00:00'))), 0) as weekly_hours
             FROM trip_assignments ta
             JOIN trips t ON ta.trip_id = t.trip_id
             WHERE ta.driver_id = ? 
             AND t.trip_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
             AND t.status != 'cancelled'`,
            [driverId]
        );
        return result[0].weekly_hours;
    },

    // Get driver's assigned trips
    getAssignedTrips: async (driverId, date = null) => {
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

    // Get driver's incident history
    getIncidents: async (driverId) => {
        const [incidents] = await pool.query(
            `SELECT i.*, t.route as trip_route
             FROM incident_reports i
             LEFT JOIN trips t ON i.trip_id = t.trip_id
             WHERE i.driver_id = ?
             ORDER BY i.incident_date DESC`,
            [driverId]
        );
        return incidents;
    },

    // Check if license is expired
    isLicenseExpired: async (driverId) => {
        const [result] = await pool.query(
            `SELECT license_expiry FROM drivers WHERE driver_id = ?`,
            [driverId]
        );
        if (result.length === 0) return true;
        return new Date(result[0].license_expiry) < new Date();
    },

    // Get available drivers for a time slot
    getAvailableDrivers: async (date, time) => {
        const [drivers] = await pool.query(
            `SELECT d.*, u.full_name
             FROM drivers d
             JOIN users u ON d.user_id = u.user_id
             WHERE u.is_active = 1
             AND d.driver_id NOT IN (
                 SELECT ta.driver_id
                 FROM trip_assignments ta
                 JOIN trips t ON ta.trip_id = t.trip_id
                 WHERE t.trip_date = ?
                 AND ABS(TIMEDIFF(t.trip_time, ?)) < 3600
                 AND t.status != 'cancelled'
             )`,
            [date, time]
        );
        return drivers;
    }
};

module.exports = DriverModel;