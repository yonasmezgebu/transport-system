const pool = require('../config/database');

const getAllVehicles = async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM vehicles WHERE 1=1';
        const params = [];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY vehicle_id DESC';
        
        const [vehicles] = await pool.query(query, params);
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const [vehicles] = await pool.query('SELECT * FROM vehicles WHERE vehicle_id = ?', [id]);
        
        if (vehicles.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        res.json(vehicles[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
};

const createVehicle = async (req, res) => {
    try {
        const { registration_number, model, capacity, fuel_type, status, current_mileage, purchase_date } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO vehicles (registration_number, model, capacity, fuel_type, status, current_mileage, purchase_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [registration_number, model, capacity, fuel_type, status || 'active', current_mileage || 0, purchase_date]);
        
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, ip_address)
            VALUES (?, 'CREATE_VEHICLE', 'vehicle', ?, ?, ?)
        `, [req.user.user_id, result.insertId, JSON.stringify(req.body), req.ip]);
        
        res.status(201).json({ message: 'Vehicle created successfully', vehicle_id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Registration number already exists' });
        }
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { registration_number, model, capacity, fuel_type, status, current_mileage } = req.body;
        
        await pool.query(`
            UPDATE vehicles 
            SET registration_number = ?, model = ?, capacity = ?, fuel_type = ?, status = ?, current_mileage = ?
            WHERE vehicle_id = ?
        `, [registration_number, model, capacity, fuel_type, status, current_mileage, id]);
        
        res.json({ message: 'Vehicle updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE vehicles SET status = ? WHERE vehicle_id = ?', ['retired', id]);
        res.json({ message: 'Vehicle retired successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retire vehicle' });
    }
};

const getVehicleMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [maintenance] = await pool.query(`
            SELECT * FROM maintenance_records
            WHERE vehicle_id = ?
            ORDER BY maintenance_date DESC
        `, [id]);
        
        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch maintenance records' });
    }
};

const getVehicleFuelLogs = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [fuelLogs] = await pool.query(`
            SELECT * FROM fuel_logs
            WHERE vehicle_id = ?
            ORDER BY log_date DESC
        `, [id]);
        
        res.json(fuelLogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fuel logs' });
    }
};

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, getVehicleMaintenance, getVehicleFuelLogs };