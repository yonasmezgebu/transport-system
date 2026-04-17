const pool = require('../config/database');

const recordMaintenance = async (req, res) => {
    try {
        const { vehicle_id, type, maintenance_date, cost_etb, mileage, description, next_due_date, next_due_mileage } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO maintenance_records (vehicle_id, type, maintenance_date, cost_etb, mileage, description, next_due_date, next_due_mileage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [vehicle_id, type, maintenance_date, cost_etb, mileage, description, next_due_date, next_due_mileage]);
        
        // Update vehicle status if needed
        if (type === 'Major Repair' || type === 'Engine Repair') {
            await pool.query('UPDATE vehicles SET status = ? WHERE vehicle_id = ?', ['maintenance', vehicle_id]);
        }
        
        res.status(201).json({ message: 'Maintenance recorded', maintenance_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to record maintenance' });
    }
};

const getUpcomingMaintenance = async (req, res) => {
    try {
        const [maintenance] = await pool.query(`
            SELECT m.*, v.registration_number, v.model, v.current_mileage
            FROM maintenance_records m
            JOIN vehicles v ON m.vehicle_id = v.vehicle_id
            WHERE (m.next_due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
            OR m.next_due_mileage <= v.current_mileage + 1000)
            AND v.status = 'active'
            ORDER BY m.next_due_date
        `);
        
        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch upcoming maintenance' });
    }
};

const getMaintenanceHistory = async (req, res) => {
    try {
        const { vehicle_id } = req.params;
        const [history] = await pool.query(`
            SELECT m.*, v.registration_number
            FROM maintenance_records m
            JOIN vehicles v ON m.vehicle_id = v.vehicle_id
            WHERE m.vehicle_id = ?
            ORDER BY m.maintenance_date DESC
        `, [vehicle_id]);
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch maintenance history' });
    }
};

const getMaintenanceReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        const [report] = await pool.query(`
            SELECT v.registration_number,
                   COUNT(*) as maintenance_count,
                   SUM(m.cost_etb) as total_cost,
                   m.type as most_common_type
            FROM maintenance_records m
            JOIN vehicles v ON m.vehicle_id = v.vehicle_id
            WHERE m.maintenance_date BETWEEN ? AND ?
            GROUP BY v.vehicle_id
        `, [start_date, end_date]);
        
        const [summary] = await pool.query(`
            SELECT 
                COUNT(*) as total_maintenance,
                SUM(cost_etb) as total_cost,
                type,
                COUNT(*) as type_count
            FROM maintenance_records
            WHERE maintenance_date BETWEEN ? AND ?
            GROUP BY type
            ORDER BY type_count DESC
            LIMIT 1
        `, [start_date, end_date]);
        
        res.json({ report, summary: summary[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate maintenance report' });
    }
};

const completeMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        
        await pool.query('UPDATE maintenance_records SET status = ? WHERE maintenance_id = ?', ['completed', id]);
        await pool.query('UPDATE vehicles SET status = ? WHERE vehicle_id = (SELECT vehicle_id FROM maintenance_records WHERE maintenance_id = ?)', ['active', id]);
        
        res.json({ message: 'Maintenance completed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to complete maintenance' });
    }
};

module.exports = { recordMaintenance, getUpcomingMaintenance, getMaintenanceHistory, getMaintenanceReport, completeMaintenance };