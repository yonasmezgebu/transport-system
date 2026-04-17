const pool = require('../config/database');

const IncidentModel = {
    // Find incident by ID
    findById: async (incidentId) => {
        const [incidents] = await pool.query(
            `SELECT i.*, u.full_name as driver_name, t.route as trip_route
             FROM incident_reports i
             JOIN drivers d ON i.driver_id = d.driver_id
             JOIN users u ON d.user_id = u.user_id
             LEFT JOIN trips t ON i.trip_id = t.trip_id
             WHERE i.incident_id = ?`,
            [incidentId]
        );
        return incidents[0];
    },

    // Get all incidents
    findAll: async (filters = {}) => {
        let query = `
            SELECT i.*, u.full_name as driver_name, t.route as trip_route
            FROM incident_reports i
            JOIN drivers d ON i.driver_id = d.driver_id
            JOIN users u ON d.user_id = u.user_id
            LEFT JOIN trips t ON i.trip_id = t.trip_id
            WHERE 1=1
        `;
        const params = [];

        if (filters.type) {
            query += ` AND i.type = ?`;
            params.push(filters.type);
        }
        if (filters.status) {
            query += ` AND i.status = ?`;
            params.push(filters.status);
        }
        if (filters.driver_id) {
            query += ` AND i.driver_id = ?`;
            params.push(filters.driver_id);
        }
        if (filters.start_date) {
            query += ` AND i.incident_date >= ?`;
            params.push(filters.start_date);
        }
        if (filters.end_date) {
            query += ` AND i.incident_date <= ?`;
            params.push(filters.end_date);
        }

        query += ` ORDER BY i.incident_date DESC, i.incident_time DESC`;
        
        const [incidents] = await pool.query(query, params);
        return incidents;
    },

    // Create incident
    create: async (incidentData) => {
        const { driver_id, trip_id, type, location, incident_date, incident_time, description, status } = incidentData;
        const [result] = await pool.query(
            `INSERT INTO incident_reports (driver_id, trip_id, type, location, incident_date, incident_time, description, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [driver_id, trip_id || null, type, location, incident_date, incident_time, description, status || 'draft']
        );
        return result.insertId;
    },

    // Update incident
    update: async (incidentId, incidentData) => {
        const { type, location, incident_date, incident_time, description, status } = incidentData;
        const [result] = await pool.query(
            `UPDATE incident_reports 
             SET type = ?, location = ?, incident_date = ?, incident_time = ?, description = ?, status = ?
             WHERE incident_id = ?`,
            [type, location, incident_date, incident_time, description, status, incidentId]
        );
        return result.affectedRows;
    },

    // Submit incident (finalize)
    submit: async (incidentId) => {
        const [result] = await pool.query(
            `UPDATE incident_reports 
             SET status = 'submitted', submitted_at = NOW()
             WHERE incident_id = ?`,
            [incidentId]
        );
        return result.affectedRows;
    },

    // Add photo to incident
    addPhoto: async (incidentId, photoPath) => {
        const [result] = await pool.query(
            `INSERT INTO incident_photos (incident_id, photo_path)
             VALUES (?, ?)`,
            [incidentId, photoPath]
        );
        return result.insertId;
    },

    // Get incident photos
    getPhotos: async (incidentId) => {
        const [photos] = await pool.query(
            `SELECT * FROM incident_photos WHERE incident_id = ?`,
            [incidentId]
        );
        return photos;
    },

    // Get incidents by driver
    findByDriver: async (driverId) => {
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

    // Get incident summary by date range
    getSummary: async (startDate, endDate) => {
        const [summary] = await pool.query(`
            SELECT 
                type,
                COUNT(*) as count,
                DATE(incident_date) as date
            FROM incident_reports
            WHERE incident_date BETWEEN ? AND ?
                AND status = 'submitted'
            GROUP BY type, DATE(incident_date)
            ORDER BY date DESC
        `, [startDate, endDate]);
        return summary;
    },

    // Get incident statistics
    getStatistics: async (startDate, endDate) => {
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total_incidents,
                type,
                COUNT(*) as type_count
            FROM incident_reports
            WHERE incident_date BETWEEN ? AND ?
                AND status = 'submitted'
            GROUP BY type
            ORDER BY type_count DESC
        `, [startDate, endDate]);
        return stats;
    }
};

module.exports = IncidentModel;