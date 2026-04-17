const pool = require('../config/database');

const MaintenanceModel = {
    // Find maintenance record by ID
    findById: async (maintenanceId) => {
        const [records] = await pool.query(
            `SELECT m.*, v.registration_number, v.model
             FROM maintenance_records m
             JOIN vehicles v ON m.vehicle_id = v.vehicle_id
             WHERE m.maintenance_id = ?`,
            [maintenanceId]
        );
        return records[0];
    },

    // Get maintenance records by vehicle
    findByVehicle: async (vehicleId) => {
        const [records] = await pool.query(
            `SELECT * FROM maintenance_records
             WHERE vehicle_id = ?
             ORDER BY maintenance_date DESC`,
            [vehicleId]
        );
        return records;
    },

    // Create maintenance record
    create: async (maintenanceData) => {
        const { vehicle_id, type, maintenance_date, cost_etb, mileage, description, next_due_date, next_due_mileage } = maintenanceData;
        const [result] = await pool.query(
            `INSERT INTO maintenance_records (vehicle_id, type, maintenance_date, cost_etb, mileage, description, next_due_date, next_due_mileage)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [vehicle_id, type, maintenance_date, cost_etb, mileage, description, next_due_date, next_due_mileage]
        );
        return result.insertId;
    },

    // Update maintenance record
    update: async (maintenanceId, maintenanceData) => {
        const { type, maintenance_date, cost_etb, mileage, description, next_due_date, next_due_mileage } = maintenanceData;
        const [result] = await pool.query(
            `UPDATE maintenance_records 
             SET type = ?, maintenance_date = ?, cost_etb = ?, mileage = ?, description = ?, next_due_date = ?, next_due_mileage = ?
             WHERE maintenance_id = ?`,
            [type, maintenance_date, cost_etb, mileage, description, next_due_date, next_due_mileage, maintenanceId]
        );
        return result.affectedRows;
    },

    // Get upcoming maintenance
    getUpcoming: async (daysAhead = 7) => {
        const [records] = await pool.query(`
            SELECT m.*, v.registration_number, v.model, v.current_mileage
            FROM maintenance_records m
            JOIN vehicles v ON m.vehicle_id = v.vehicle_id
            WHERE (m.next_due_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
            OR m.next_due_mileage <= v.current_mileage + 1000)
            AND v.status = 'active'
            ORDER BY m.next_due_date
        `, [daysAhead]);
        return records;
    },

    // Get maintenance summary by date range
    getSummary: async (startDate, endDate) => {
        const [summary] = await pool.query(`
            SELECT 
                COUNT(*) as total_maintenance,
                SUM(cost_etb) as total_cost,
                type,
                COUNT(*) as type_count,
                SUM(cost_etb) as cost_by_type
            FROM maintenance_records
            WHERE maintenance_date BETWEEN ? AND ?
            GROUP BY type
            ORDER BY cost_by_type DESC
        `, [startDate, endDate]);
        return summary;
    },

    // Get maintenance report by vehicle
    getReportByVehicle: async (startDate, endDate) => {
        const [report] = await pool.query(`
            SELECT v.registration_number,
                   COUNT(m.maintenance_id) as maintenance_count,
                   SUM(m.cost_etb) as total_cost,
                   AVG(m.cost_etb) as avg_cost
            FROM maintenance_records m
            JOIN vehicles v ON m.vehicle_id = v.vehicle_id
            WHERE m.maintenance_date BETWEEN ? AND ?
            GROUP BY v.vehicle_id
            ORDER BY total_cost DESC
        `, [startDate, endDate]);
        return report;
    },

    // Get vehicle maintenance cost
    getVehicleCost: async (vehicleId, startDate, endDate) => {
        const [cost] = await pool.query(`
            SELECT 
                SUM(cost_etb) as total_cost,
                COUNT(*) as maintenance_count
            FROM maintenance_records
            WHERE vehicle_id = ?
            AND maintenance_date BETWEEN ? AND ?
        `, [vehicleId, startDate, endDate]);
        return cost[0];
    },

    // Schedule next maintenance
    scheduleNext: async (vehicleId, type, nextDueDate, nextDueMileage) => {
        const [result] = await pool.query(
            `INSERT INTO maintenance_records (vehicle_id, type, maintenance_date, cost_etb, mileage, next_due_date, next_due_mileage)
             VALUES (?, ?, CURDATE(), 0, (SELECT current_mileage FROM vehicles WHERE vehicle_id = ?), ?, ?)`,
            [vehicleId, type, vehicleId, nextDueDate, nextDueMileage]
        );
        return result.insertId;
    }
};

module.exports = MaintenanceModel;