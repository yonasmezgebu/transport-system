const pool = require('../config/database');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/incidents');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const createIncident = async (req, res) => {
    try {
        const { type, location, incident_date, incident_time, description, trip_id, status } = req.body;
        
        const [driver] = await pool.query('SELECT driver_id FROM drivers WHERE user_id = ?', [req.user.user_id]);
        
        if (driver.length === 0) {
            return res.status(400).json({ error: 'Driver profile not found' });
        }
        
        const [result] = await pool.query(`
            INSERT INTO incident_reports (driver_id, trip_id, type, location, incident_date, incident_time, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [driver[0].driver_id, trip_id || null, type, location, incident_date, incident_time, description, status || 'draft']);
        
        res.status(201).json({ message: 'Incident report created', incident_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create incident report' });
    }
};

const submitIncident = async (req, res) => {
    try {
        const { id } = req.params;
        
        await pool.query(`
            UPDATE incident_reports 
            SET status = 'submitted', submitted_at = NOW()
            WHERE incident_id = ?
        `, [id]);
        
        res.json({ message: 'Incident report submitted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit incident report' });
    }
};

const getIncidents = async (req, res) => {
    try {
        let query = `
            SELECT i.*, u.full_name as driver_name, t.route as trip_route,
                   (SELECT COUNT(*) FROM incident_photos WHERE incident_id = i.incident_id) as photo_count
            FROM incident_reports i
            JOIN drivers d ON i.driver_id = d.driver_id
            JOIN users u ON d.user_id = u.user_id
            LEFT JOIN trips t ON i.trip_id = t.trip_id
        `;
        
        if (req.user.role_name === 'driver') {
            const [driver] = await pool.query('SELECT driver_id FROM drivers WHERE user_id = ?', [req.user.user_id]);
            query += ` WHERE i.driver_id = ${driver[0].driver_id}`;
        }
        
        query += ` ORDER BY i.incident_date DESC, i.incident_time DESC`;
        
        const [incidents] = await pool.query(query);
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incidents' });
    }
};

const getIncidentById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [incidents] = await pool.query(`
            SELECT i.*, u.full_name as driver_name, t.route as trip_route
            FROM incident_reports i
            JOIN drivers d ON i.driver_id = d.driver_id
            JOIN users u ON d.user_id = u.user_id
            LEFT JOIN trips t ON i.trip_id = t.trip_id
            WHERE i.incident_id = ?
        `, [id]);
        
        if (incidents.length === 0) {
            return res.status(404).json({ error: 'Incident not found' });
        }
        
        const [photos] = await pool.query('SELECT * FROM incident_photos WHERE incident_id = ?', [id]);
        
        res.json({ ...incidents[0], photos });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incident' });
    }
};

const uploadPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const photoPath = `/uploads/incidents/${req.file.filename}`;
        
        await pool.query(`
            INSERT INTO incident_photos (incident_id, photo_path)
            VALUES (?, ?)
        `, [id, photoPath]);
        
        res.json({ message: 'Photo uploaded', photo_path: photoPath });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload photo' });
    }
};

const getIncidentReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        const [report] = await pool.query(`
            SELECT 
                type,
                COUNT(*) as count,
                DATE(incident_date) as date
            FROM incident_reports
            WHERE incident_date BETWEEN ? AND ?
                AND status = 'submitted'
            GROUP BY type, DATE(incident_date)
            ORDER BY date DESC
        `, [start_date, end_date]);
        
        const [summary] = await pool.query(`
            SELECT 
                COUNT(*) as total_incidents,
                type,
                COUNT(*) as type_count
            FROM incident_reports
            WHERE incident_date BETWEEN ? AND ?
                AND status = 'submitted'
            GROUP BY type
            ORDER BY type_count DESC
        `, [start_date, end_date]);
        
        res.json({ report, summary });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate incident report' });
    }
};

module.exports = { createIncident, submitIncident, getIncidents, getIncidentById, uploadPhoto, getIncidentReport };