const pool = require('../config/database');

const FuelModel = {
    // Find fuel log by ID
    findById: async (fuelLogId) => {
        const [logs] = await pool.query(
            `SELECT f.*, v.registration_number
             FROM fuel_logs f
             JOIN vehicles v ON f.vehicle_id = v.vehicle_id
             WHERE f.fuel_log_id = ?`,
            [fuelLogId]
        );
        return logs[0];
    },

    // Get fuel logs by vehicle
    findByVehicle: async (vehicleId, limit = null) => {
        let query = `
            SELECT f.*, v.registration_number
            FROM fuel_logs f
            JOIN vehicles v ON f.vehicle_id = v.vehicle_id
            WHERE f.vehicle_id = ?
            ORDER BY f.log_date DESC
        `;
        if (limit) {
            query += ` LIMIT ?`;
            const [logs] = await pool.query(query, [vehicleId, limit]);
            return logs;
        }
        const [logs] = await pool.query(query, [vehicleId]);
        return logs;
    },

    // Create fuel log
    create: async (fuelData) => {
        const { vehicle_id, log_date, liters, cost_etb, mileage } = fuelData;
        const [result] = await pool.query(
            `INSERT INTO fuel_logs (vehicle_id, log_date, liters, cost_etb, mileage)
             VALUES (?, ?, ?, ?, ?)`,
            [vehicle_id, log_date, liters, cost_etb, mileage]
        );
        return result.insertId;
    },

    // Get last fuel log for vehicle
    getLastLog: async (vehicleId) => {
        const [logs] = await pool.query(
            `SELECT * FROM fuel_logs
             WHERE vehicle_id = ?
             ORDER BY log_date DESC, created_at DESC
             LIMIT 1`,
            [vehicleId]
        );
        return logs[0];
    },

    // Get fuel summary by date range
    getSummary: async (startDate, endDate, vehicleId = null) => {
        let query = `
            SELECT 
                SUM(liters) as total_liters,
                SUM(cost_etb) as total_cost,
                COUNT(*) as refill_count,
                ROUND(SUM(cost_etb) / SUM(liters), 2) as avg_cost_per_liter
            FROM fuel_logs
            WHERE log_date BETWEEN ? AND ?
        `;
        const params = [startDate, endDate];

        if (vehicleId) {
            query += ` AND vehicle_id = ?`;
            params.push(vehicleId);
        }

        const [summary] = await pool.query(query, params);
        return summary[0];
    },

    // Get fuel report by vehicle
    getReportByVehicle: async (startDate, endDate) => {
        const [report] = await pool.query(`
            SELECT v.registration_number,
                   COUNT(f.fuel_log_id) as refill_count,
                   SUM(f.liters) as total_liters,
                   SUM(f.cost_etb) as total_cost,
                   ROUND(SUM(f.cost_etb) / SUM(f.liters), 2) as avg_cost_per_liter
            FROM fuel_logs f
            JOIN vehicles v ON f.vehicle_id = v.vehicle_id
            WHERE f.log_date BETWEEN ? AND ?
            GROUP BY v.vehicle_id
            ORDER BY total_cost DESC
        `, [startDate, endDate]);
        return report;
    },

    // Calculate fuel efficiency
    calculateEfficiency: async (vehicleId, startDate, endDate) => {
        const [efficiency] = await pool.query(`
            SELECT 
                f1.mileage as start_mileage,
                f2.mileage as end_mileage,
                f2.liters,
                ROUND((f2.mileage - f1.mileage) / f2.liters, 2) as km_per_liter
            FROM fuel_logs f1
            JOIN fuel_logs f2 ON f1.vehicle_id = f2.vehicle_id 
                AND f2.log_date > f1.log_date
            WHERE f1.vehicle_id = ?
            AND f1.log_date >= ?
            AND f2.log_date <= ?
            ORDER BY f2.log_date DESC
            LIMIT 1
        `, [vehicleId, startDate, endDate]);
        return efficiency[0];
    },

    // Validate mileage progression
    validateMileage: async (vehicleId, newMileage) => {
        const lastLog = await FuelModel.getLastLog(vehicleId);
        if (lastLog && newMileage <= lastLog.mileage) {
            return { valid: false, lastMileage: lastLog.mileage };
        }
        return { valid: true, lastMileage: lastLog?.mileage || 0 };
    }
};

module.exports = FuelModel;