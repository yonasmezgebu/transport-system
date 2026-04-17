const pool = require('../config/database');

const recordFuelPurchase = async (req, res) => {
    try {
        const { vehicle_id, log_date, liters, cost_etb, mileage } = req.body;
        
        // Check if mileage is greater than previous
        const [lastLog] = await pool.query(`
            SELECT mileage FROM fuel_logs 
            WHERE vehicle_id = ? 
            ORDER BY log_date DESC, created_at DESC LIMIT 1
        `, [vehicle_id]);
        
        if (lastLog.length > 0 && mileage <= lastLog[0].mileage) {
            return res.status(400).json({ error: 'Mileage must be greater than previous reading' });
        }
        
        const [result] = await pool.query(`
            INSERT INTO fuel_logs (vehicle_id, log_date, liters, cost_etb, mileage)
            VALUES (?, ?, ?, ?, ?)
        `, [vehicle_id, log_date, liters, cost_etb, mileage]);
        
        // Update vehicle mileage
        await pool.query('UPDATE vehicles SET current_mileage = ? WHERE vehicle_id = ?', [mileage, vehicle_id]);
        
        res.status(201).json({ message: 'Fuel purchase recorded', fuel_log_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to record fuel purchase' });
    }
};

const getFuelLogs = async (req, res) => {
    try {
        const { vehicle_id } = req.params;
        const [logs] = await pool.query(`
            SELECT f.*, v.registration_number 
            FROM fuel_logs f
            JOIN vehicles v ON f.vehicle_id = v.vehicle_id
            WHERE f.vehicle_id = ?
            ORDER BY f.log_date DESC
        `, [vehicle_id]);
        
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fuel logs' });
    }
};

const getFuelReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        const [report] = await pool.query(`
            SELECT v.registration_number, 
                   SUM(f.liters) as total_liters,
                   SUM(f.cost_etb) as total_cost,
                   COUNT(*) as refill_count,
                   ROUND(SUM(f.cost_etb) / SUM(f.liters), 2) as avg_cost_per_liter
            FROM fuel_logs f
            JOIN vehicles v ON f.vehicle_id = v.vehicle_id
            WHERE f.log_date BETWEEN ? AND ?
            GROUP BY v.vehicle_id
        `, [start_date, end_date]);
        
        const [summary] = await pool.query(`
            SELECT 
                SUM(liters) as total_liters,
                SUM(cost_etb) as total_cost,
                COUNT(*) as total_refills
            FROM fuel_logs
            WHERE log_date BETWEEN ? AND ?
        `, [start_date, end_date]);
        
        res.json({ report, summary: summary[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate fuel report' });
    }
};

const getFuelEfficiency = async (req, res) => {
    try {
        const { vehicle_id } = req.params;
        
        const [efficiency] = await pool.query(`
            SELECT 
                f1.log_date,
                f1.mileage as start_mileage,
                f2.mileage as end_mileage,
                f2.liters,
                ROUND((f2.mileage - f1.mileage) / f2.liters, 2) as km_per_liter
            FROM fuel_logs f1
            JOIN fuel_logs f2 ON f1.vehicle_id = f2.vehicle_id 
                AND f2.log_date > f1.log_date
            WHERE f1.vehicle_id = ?
            ORDER BY f2.log_date DESC
            LIMIT 5
        `, [vehicle_id]);
        
        res.json(efficiency);
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate fuel efficiency' });
    }
};

module.exports = { recordFuelPurchase, getFuelLogs, getFuelReport, getFuelEfficiency };