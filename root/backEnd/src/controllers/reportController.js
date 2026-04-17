const pool = require('../config/database');

const getOperationalReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        const [trips] = await pool.query(`
            SELECT 
                COUNT(*) as total_trips,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_trips,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_trips,
                SUM(CASE WHEN status = 'delayed' THEN 1 ELSE 0 END) as delayed_trips,
                ROUND(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as completion_rate
            FROM trips
            WHERE trip_date BETWEEN ? AND ?
        `, [start_date, end_date]);
        
        const [routeBreakdown] = await pool.query(`
            SELECT route, COUNT(*) as trip_count
            FROM trips
            WHERE trip_date BETWEEN ? AND ?
            GROUP BY route
        `, [start_date, end_date]);
        
        const [dailyStats] = await pool.query(`
            SELECT 
                trip_date,
                COUNT(*) as trips,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM trips
            WHERE trip_date BETWEEN ? AND ?
            GROUP BY trip_date
            ORDER BY trip_date
        `, [start_date, end_date]);
        
        res.json({
            summary: trips[0],
            route_breakdown: routeBreakdown,
            daily_stats: dailyStats
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate operational report' });
    }
};

const getFinancialReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        const [fuel] = await pool.query(`
            SELECT 
                SUM(cost_etb) as total_fuel_cost, 
                SUM(liters) as total_liters,
                ROUND(SUM(cost_etb) / SUM(liters), 2) as avg_cost_per_liter
            FROM fuel_logs
            WHERE log_date BETWEEN ? AND ?
        `, [start_date, end_date]);
        
        const [maintenance] = await pool.query(`
            SELECT 
                SUM(cost_etb) as total_maintenance_cost,
                COUNT(*) as total_maintenance_activities,
                type,
                SUM(cost_etb) as cost_by_type
            FROM maintenance_records
            WHERE maintenance_date BETWEEN ? AND ?
            GROUP BY type
            ORDER BY cost_by_type DESC
        `, [start_date, end_date]);
        
        const [vehicleCosts] = await pool.query(`
            SELECT 
                v.registration_number,
                COALESCE(f.total_fuel, 0) as fuel_cost,
                COALESCE(m.total_maintenance, 0) as maintenance_cost,
                COALESCE(f.total_fuel, 0) + COALESCE(m.total_maintenance, 0) as total_cost
            FROM vehicles v
            LEFT JOIN (
                SELECT vehicle_id, SUM(cost_etb) as total_fuel
                FROM fuel_logs
                WHERE log_date BETWEEN ? AND ?
                GROUP BY vehicle_id
            ) f ON v.vehicle_id = f.vehicle_id
            LEFT JOIN (
                SELECT vehicle_id, SUM(cost_etb) as total_maintenance
                FROM maintenance_records
                WHERE maintenance_date BETWEEN ? AND ?
                GROUP BY vehicle_id
            ) m ON v.vehicle_id = m.vehicle_id
            ORDER BY total_cost DESC
        `, [start_date, end_date, start_date, end_date]);
        
        res.json({
            fuel: fuel[0],
            maintenance: maintenance,
            vehicle_costs: vehicleCosts,
            total: (fuel[0].total_fuel_cost || 0) + (maintenance.reduce((sum, m) => sum + (m.total_maintenance_cost || 0), 0))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate financial report' });
    }
};

const getDriverPerformanceReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        const [drivers] = await pool.query(`
            SELECT 
                u.full_name,
                d.driver_id,
                COUNT(DISTINCT t.trip_id) as trips_completed,
                COALESCE(AVG(f.rating), 0) as avg_rating,
                COALESCE(SUM(TIMESTAMPDIFF(HOUR, t.trip_time, ADDTIME(t.trip_time, '02:00:00'))), 0) as total_hours,
                COUNT(DISTINCT i.incident_id) as incident_count
            FROM drivers d
            JOIN users u ON d.user_id = u.user_id
            LEFT JOIN trip_assignments ta ON d.driver_id = ta.driver_id
            LEFT JOIN trips t ON ta.trip_id = t.trip_id AND t.status = 'completed' AND t.trip_date BETWEEN ? AND ?
            LEFT JOIN feedback f ON t.trip_id = f.trip_id
            LEFT JOIN incident_reports i ON d.driver_id = i.driver_id AND i.incident_date BETWEEN ? AND ?
            GROUP BY d.driver_id
            ORDER BY avg_rating DESC
        `, [start_date, end_date, start_date, end_date]);
        
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate driver performance report' });
    }
};

const getVehicleUtilizationReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        const [utilization] = await pool.query(`
            SELECT 
                v.registration_number,
                v.model,
                COUNT(t.trip_id) as total_trips,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_trips,
                ROUND(AVG(t.expected_passenger_count / v.capacity * 100), 2) as avg_occupancy
            FROM vehicles v
            LEFT JOIN trip_assignments ta ON v.vehicle_id = ta.vehicle_id
            LEFT JOIN trips t ON ta.trip_id = t.trip_id AND t.trip_date BETWEEN ? AND ?
            GROUP BY v.vehicle_id
            ORDER BY total_trips DESC
        `, [start_date, end_date]);
        
        res.json(utilization);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate vehicle utilization report' });
    }
};

module.exports = { getOperationalReport, getFinancialReport, getDriverPerformanceReport, getVehicleUtilizationReport };