const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../config/mail');

const getAllDrivers = async (req, res) => {
    try {
        const [drivers] = await pool.query(`
            SELECT d.*, u.full_name, u.email, u.phone, u.is_active
            FROM drivers d
            JOIN users u ON d.user_id = u.user_id
            ORDER BY d.driver_id DESC
        `);
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
};

const getDriverById = async (req, res) => {
    try {
        const { id } = req.params;
        const [drivers] = await pool.query(`
            SELECT d.*, u.full_name, u.email, u.phone, u.is_active
            FROM drivers d
            JOIN users u ON d.user_id = u.user_id
            WHERE d.driver_id = ?
        `, [id]);
        
        if (drivers.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        
        res.json(drivers[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch driver' });
    }
};

const createDriver = async (req, res) => {
    try {
        const { full_name, email, phone, license_number, license_expiry, hire_date } = req.body;
        
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash('Driver@123', 10);
        
        const [userResult] = await pool.query(`
            INSERT INTO users (email, password_hash, full_name, phone, role_id, is_active)
            VALUES (?, ?, ?, ?, (SELECT role_id FROM roles WHERE role_name = 'driver'), 1)
        `, [email, hashedPassword, full_name, phone]);
        
        const user_id = userResult.insertId;
        
        const [driverResult] = await pool.query(`
            INSERT INTO drivers (user_id, license_number, license_expiry, hire_date)
            VALUES (?, ?, ?, ?)
        `, [user_id, license_number, license_expiry, hire_date]);
        
        await sendWelcomeEmail(email, full_name, 'Driver');
        
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, ip_address)
            VALUES (?, 'CREATE_DRIVER', 'driver', ?, ?, ?)
        `, [req.user.user_id, driverResult.insertId, JSON.stringify(req.body), req.ip]);
        
        res.status(201).json({ message: 'Driver created successfully', driver_id: driverResult.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'License number already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create driver' });
    }
};

const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, phone, license_number, license_expiry } = req.body;
        
        const [driver] = await pool.query('SELECT user_id FROM drivers WHERE driver_id = ?', [id]);
        if (driver.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        
        await pool.query('UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?', 
            [full_name, phone, driver[0].user_id]);
        
        await pool.query('UPDATE drivers SET license_number = ?, license_expiry = ? WHERE driver_id = ?',
            [license_number, license_expiry, id]);
        
        res.json({ message: 'Driver updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update driver' });
    }
};

const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [driver] = await pool.query('SELECT user_id FROM drivers WHERE driver_id = ?', [id]);
        if (driver.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        
        await pool.query('UPDATE users SET is_active = 0 WHERE user_id = ?', [driver[0].user_id]);
        
        res.json({ message: 'Driver deactivated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to deactivate driver' });
    }
};

const getDriverHours = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [hours] = await pool.query(`
            SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, t.trip_time, ADDTIME(t.trip_time, '02:00:00'))), 0) as weekly_hours
            FROM trip_assignments ta
            JOIN trips t ON ta.trip_id = t.trip_id
            WHERE ta.driver_id = ? 
            AND t.trip_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
            AND t.status != 'cancelled'
        `, [id]);
        
        res.json({ weekly_hours: hours[0].weekly_hours, max_hours: 48 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch driver hours' });
    }
};

const getDriverIncidents = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [incidents] = await pool.query(`
            SELECT i.*, t.route as trip_route
            FROM incident_reports i
            LEFT JOIN trips t ON i.trip_id = t.trip_id
            WHERE i.driver_id = ?
            ORDER BY i.incident_date DESC
        `, [id]);
        
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch driver incidents' });
    }
};

module.exports = { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver, getDriverHours, getDriverIncidents };