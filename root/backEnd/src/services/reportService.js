const pool = require('../config/database');

const ReportService = {
    // Generate operational report
    generateOperationalReport: async (startDate, endDate) => {
        const [trips] = await pool.query(`
            SELECT 
                COUNT(*) as total_trips,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_trips,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_trips,
                SUM(CASE WHEN status = 'delayed' THEN 1 ELSE 0 END) as delayed_trips,
                ROUND(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as completion_rate,
                ROUND(AVG(expected_passenger_count), 2) as avg_passengers
            FROM trips
            WHERE trip_date BETWEEN ? AND ?
        `, [startDate, endDate]);

        const [routeBreakdown] = await pool.query(`
            SELECT route, COUNT(*) as trip_count,
                   ROUND(COUNT(*) / (SELECT COUNT(*) FROM trips WHERE trip_date BETWEEN ? AND ?) * 100, 2) as percentage
            FROM trips
            WHERE trip_date BETWEEN ? AND ?
            GROUP BY route
            ORDER BY trip_count DESC
        `, [startDate, endDate, startDate, endDate]);

        const [dailyStats] = await pool.query(`
            SELECT 
                trip_date,
                COUNT(*) as trips,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
            FROM trips
            WHERE trip_date BETWEEN ? AND ?
            GROUP BY trip_date
            ORDER BY trip_date
        `, [startDate, endDate]);

        return {
            summary: trips[0],
            route_breakdown: routeBreakdown,
            daily_stats: dailyStats,
            generated_at: new Date().toISOString(),
            date_range: { start_date: startDate, end_date: endDate }
        };
    },

    // Generate financial report
    generateFinancialReport: async (startDate, endDate) => {
        const [fuel] = await pool.query(`
            SELECT 
                SUM(cost_etb) as total_fuel_cost,
                SUM(liters) as total_liters,
                COUNT(*) as refill_count,
                ROUND(SUM(cost_etb) / SUM(liters), 2) as avg_cost_per_liter,
                ROUND(AVG(cost_etb), 2) as avg_cost_per_refill
            FROM fuel_logs
            WHERE log_date BETWEEN ? AND ?
        `, [startDate, endDate]);

        const [maintenance] = await pool.query(`
            SELECT 
                SUM(cost_etb) as total_maintenance_cost,
                COUNT(*) as total_maintenance_activities,
                AVG(cost_etb) as avg_maintenance_cost
            FROM maintenance_records
            WHERE maintenance_date BETWEEN ? AND ?
        `, [startDate, endDate]);

        const [vehicleCosts] = await pool.query(`
            SELECT 
                v.registration_number,
                v.model,
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
        `, [startDate, endDate, startDate, endDate]);

        return {
            fuel: fuel[0] || { total_fuel_cost: 0, total_liters: 0, refill_count: 0 },
            maintenance: maintenance[0] || { total_maintenance_cost: 0, total_maintenance_activities: 0 },
            vehicle_costs: vehicleCosts,
            total: (fuel[0]?.total_fuel_cost || 0) + (maintenance[0]?.total_maintenance_cost || 0),
            generated_at: new Date().toISOString(),
            date_range: { start_date: startDate, end_date: endDate }
        };
    },

    // Generate driver performance report
    generateDriverReport: async (startDate, endDate) => {
        const [drivers] = await pool.query(`
            SELECT 
                u.full_name,
                d.driver_id,
                d.license_number,
                COUNT(DISTINCT t.trip_id) as trips_completed,
                COALESCE(AVG(f.rating), 0) as avg_rating,
                COALESCE(SUM(TIMESTAMPDIFF(HOUR, t.trip_time, ADDTIME(t.trip_time, '02:00:00'))), 0) as total_hours,
                COUNT(DISTINCT i.incident_id) as incident_count,
                ROUND(AVG(f.rating) * 20, 2) as performance_score
            FROM drivers d
            JOIN users u ON d.user_id = u.user_id
            LEFT JOIN trip_assignments ta ON d.driver_id = ta.driver_id
            LEFT JOIN trips t ON ta.trip_id = t.trip_id AND t.status = 'completed' AND t.trip_date BETWEEN ? AND ?
            LEFT JOIN feedback f ON t.trip_id = f.trip_id
            LEFT JOIN incident_reports i ON d.driver_id = i.driver_id AND i.incident_date BETWEEN ? AND ?
            GROUP BY d.driver_id
            ORDER BY performance_score DESC
        `, [startDate, endDate, startDate, endDate]);

        return {
            drivers: drivers,
            summary: {
                total_drivers: drivers.length,
                avg_rating: (drivers.reduce((sum, d) => sum + (d.avg_rating || 0), 0) / drivers.length).toFixed(2),
                total_hours: drivers.reduce((sum, d) => sum + (d.total_hours || 0), 0),
                total_incidents: drivers.reduce((sum, d) => sum + (d.incident_count || 0), 0)
            },
            generated_at: new Date().toISOString(),
            date_range: { start_date: startDate, end_date: endDate }
        };
    },

    // Generate vehicle utilization report
    generateVehicleUtilizationReport: async (startDate, endDate) => {
        const [utilization] = await pool.query(`
            SELECT 
                v.registration_number,
                v.model,
                v.capacity,
                COUNT(t.trip_id) as total_trips,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_trips,
                ROUND(AVG(t.expected_passenger_count / v.capacity * 100), 2) as avg_occupancy,
                SUM(t.expected_passenger_count) as total_passengers
            FROM vehicles v
            LEFT JOIN trip_assignments ta ON v.vehicle_id = ta.vehicle_id
            LEFT JOIN trips t ON ta.trip_id = t.trip_id AND t.trip_date BETWEEN ? AND ?
            GROUP BY v.vehicle_id
            ORDER BY total_trips DESC
        `, [startDate, endDate]);

        return {
            utilization: utilization,
            summary: {
                total_vehicles: utilization.length,
                total_trips: utilization.reduce((sum, v) => sum + (v.total_trips || 0), 0),
                avg_occupancy: (utilization.reduce((sum, v) => sum + (v.avg_occupancy || 0), 0) / utilization.length).toFixed(2)
            },
            generated_at: new Date().toISOString(),
            date_range: { start_date: startDate, end_date: endDate }
        };
    },

    // Export report to CSV format
    exportToCSV: (data, reportType) => {
        if (!data || !Array.isArray(data)) return '';
        
        const headers = Object.keys(data[0] || {});
        const rows = data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','));
        return [headers.join(','), ...rows].join('\n');
    },

    // Export report to JSON
    exportToJSON: (data) => {
        return JSON.stringify(data, null, 2);
    }
};

module.exports = ReportService;