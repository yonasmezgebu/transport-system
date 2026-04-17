const pool = require('../config/database');

const VehicleModel = {
    // Find vehicle by ID
    findById: async (vehicleId) => {
        const [vehicles] = await pool.query(
            `SELECT * FROM vehicles WHERE vehicle_id = ?`,
            [vehicleId]
        );
        return vehicles[0];
    },

    // Find vehicle by registration number
    findByRegistration: async (registrationNumber) => {
        const [vehicles] = await pool.query(
            `SELECT * FROM vehicles WHERE registration_number = ?`,
            [registrationNumber]
        );
        return vehicles[0];
    },

    // Get all vehicles
    findAll: async (filters = {}) => {
        let query = `SELECT * FROM vehicles WHERE 1=1`;
        const params = [];

        if (filters.status) {
            query += ` AND status = ?`;
            params.push(filters.status);
        }
        if (filters.fuel_type) {
            query += ` AND fuel_type = ?`;
            params.push(filters.fuel_type);
        }

        query += ` ORDER BY vehicle_id DESC`;
        
        const [vehicles] = await pool.query(query, params);
        return vehicles;
    },

    // Create vehicle
    create: async (vehicleData) => {
        const { registration_number, model, capacity, fuel_type, status, current_mileage, purchase_date } = vehicleData;
        const [result] = await pool.query(
            `INSERT INTO vehicles (registration_number, model, capacity, fuel_type, status, current_mileage, purchase_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [registration_number, model, capacity, fuel_type, status || 'active', current_mileage || 0, purchase_date]
        );
        return result.insertId;
    },

    // Update vehicle
    update: async (vehicleId, vehicleData) => {
        const { registration_number, model, capacity, fuel_type, status, current_mileage } = vehicleData;
        const [result] = await pool.query(
            `UPDATE vehicles 
             SET registration_number = ?, model = ?, capacity = ?, fuel_type = ?, status = ?, current_mileage = ?
             WHERE vehicle_id = ?`,
            [registration_number, model, capacity, fuel_type, status, current_mileage, vehicleId]
        );
        return result.affectedRows;
    },

    // Update vehicle status
    updateStatus: async (vehicleId, status) => {
        const [result] = await pool.query(
            `UPDATE vehicles SET status = ? WHERE vehicle_id = ?`,
            [status, vehicleId]
        );
        return result.affectedRows;
    },

    // Update mileage
    updateMileage: async (vehicleId, mileage) => {
        const [result] = await pool.query(
            `UPDATE vehicles SET current_mileage = ? WHERE vehicle_id = ?`,
            [mileage, vehicleId]
        );
        return result.affectedRows;
    },

    // Get available vehicles for a time slot
    getAvailableVehicles: async (date, time, requiredCapacity = null) => {
        let query = `
            SELECT v.*
            FROM vehicles v
            WHERE v.status = 'active'
            AND v.vehicle_id NOT IN (
                SELECT ta.vehicle_id
                FROM trip_assignments ta
                JOIN trips t ON ta.trip_id = t.trip_id
                WHERE t.trip_date = ?
                AND ABS(TIMEDIFF(t.trip_time, ?)) < 3600
                AND t.status != 'cancelled'
            )
        `;
        const params = [date, time];

        if (requiredCapacity) {
            query += ` AND v.capacity >= ?`;
            params.push(requiredCapacity);
        }

        const [vehicles] = await pool.query(query, params);
        return vehicles;
    },

    // Get vehicle maintenance history
    getMaintenanceHistory: async (vehicleId) => {
        const [maintenance] = await pool.query(
            `SELECT * FROM maintenance_records
             WHERE vehicle_id = ?
             ORDER BY maintenance_date DESC`,
            [vehicleId]
        );
        return maintenance;
    },

    // Get vehicle fuel logs
    getFuelLogs: async (vehicleId) => {
        const [fuelLogs] = await pool.query(
            `SELECT * FROM fuel_logs
             WHERE vehicle_id = ?
             ORDER BY log_date DESC`,
            [vehicleId]
        );
        return fuelLogs;
    },

    // Get vehicle utilization stats
    getUtilizationStats: async (vehicleId, startDate, endDate) => {
        const [stats] = await pool.query(
            `SELECT COUNT(*) as trip_count,
                    SUM(expected_passenger_count) as total_passengers,
                    AVG(expected_passenger_count / v.capacity * 100) as avg_occupancy
             FROM trips t
             JOIN trip_assignments ta ON t.trip_id = ta.trip_id
             JOIN vehicles v ON ta.vehicle_id = v.vehicle_id
             WHERE ta.vehicle_id = ?
             AND t.trip_date BETWEEN ? AND ?
             AND t.status = 'completed'`,
            [vehicleId, startDate, endDate]
        );
        return stats[0];
    },

    // Get vehicles needing maintenance
    getVehiclesNeedingMaintenance: async () => {
        const [vehicles] = await pool.query(`
            SELECT v.*, m.next_due_date, m.next_due_mileage
            FROM vehicles v
            JOIN maintenance_records m ON v.vehicle_id = m.vehicle_id
            WHERE (m.next_due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
            OR m.next_due_mileage <= v.current_mileage + 1000)
            AND v.status = 'active'
        `);
        return vehicles;
    }
};

module.exports = VehicleModel;