const pool = require('../config/database');

const ConflictDetectionService = {
    // Check if driver is available for a given time slot
    checkDriverAvailability: async (driverId, date, time, bufferMinutes = 30) => {
        const bufferSeconds = bufferMinutes * 60;
        const [conflicts] = await pool.query(`
            SELECT t.* FROM trip_assignments ta
            JOIN trips t ON ta.trip_id = t.trip_id
            WHERE ta.driver_id = ? 
            AND t.trip_date = ?
            AND ABS(TIMEDIFF(t.trip_time, ?)) < ?
            AND t.status NOT IN ('cancelled', 'completed')
        `, [driverId, date, time, bufferSeconds]);
        
        return {
            available: conflicts.length === 0,
            conflicts: conflicts
        };
    },

    // Check if vehicle is available for a given time slot
    checkVehicleAvailability: async (vehicleId, date, time, bufferMinutes = 30) => {
        const bufferSeconds = bufferMinutes * 60;
        const [conflicts] = await pool.query(`
            SELECT t.* FROM trip_assignments ta
            JOIN trips t ON ta.trip_id = t.trip_id
            WHERE ta.vehicle_id = ? 
            AND t.trip_date = ?
            AND ABS(TIMEDIFF(t.trip_time, ?)) < ?
            AND t.status NOT IN ('cancelled', 'completed')
        `, [vehicleId, date, time, bufferSeconds]);
        
        return {
            available: conflicts.length === 0,
            conflicts: conflicts
        };
    },

    // Check driver weekly hours limit
    checkDriverWeeklyHours: async (driverId, date, tripDurationHours = 2) => {
        // Get current week's start date (Monday)
        const weekStart = new Date(date);
        const day = weekStart.getDay();
        const diff = (day === 0 ? 6 : day - 1);
        weekStart.setDate(weekStart.getDate() - diff);
        
        const [hours] = await pool.query(`
            SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, t.trip_time, ADDTIME(t.trip_time, '02:00:00'))), 0) as weekly_hours
            FROM trip_assignments ta
            JOIN trips t ON ta.trip_id = t.trip_id
            WHERE ta.driver_id = ? 
            AND t.trip_date >= ?
            AND t.status NOT IN ('cancelled')
        `, [driverId, weekStart.toISOString().split('T')[0]]);
        
        const currentHours = hours[0].weekly_hours;
        const wouldExceed = (currentHours + tripDurationHours) > 48;
        
        return {
            current_hours: currentHours,
            remaining_hours: 48 - currentHours,
            would_exceed: wouldExceed,
            max_hours: 48
        };
    },

    // Check driver daily hours limit
    checkDriverDailyHours: async (driverId, date, tripDurationHours = 2) => {
        const [hours] = await pool.query(`
            SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, t.trip_time, ADDTIME(t.trip_time, '02:00:00'))), 0) as daily_hours
            FROM trip_assignments ta
            JOIN trips t ON ta.trip_id = t.trip_id
            WHERE ta.driver_id = ? 
            AND t.trip_date = ?
            AND t.status NOT IN ('cancelled')
        `, [driverId, date]);
        
        const currentHours = hours[0].daily_hours;
        const wouldExceed = (currentHours + tripDurationHours) > 8;
        
        return {
            current_hours: currentHours,
            remaining_hours: 8 - currentHours,
            would_exceed: wouldExceed,
            max_hours: 8
        };
    },

    // Check vehicle capacity
    checkVehicleCapacity: async (vehicleId, passengerCount) => {
        const [vehicle] = await pool.query('SELECT capacity FROM vehicles WHERE vehicle_id = ?', [vehicleId]);
        
        if (vehicle.length === 0) {
            return { sufficient: false, capacity: 0, message: 'Vehicle not found' };
        }
        
        const capacity = vehicle[0].capacity;
        return {
            sufficient: capacity >= passengerCount,
            capacity: capacity,
            requested: passengerCount,
            message: capacity >= passengerCount ? 'Capacity sufficient' : `Vehicle capacity (${capacity}) is less than requested (${passengerCount})`
        };
    },

    // Check if driver license is valid
    checkDriverLicenseValid: async (driverId) => {
        const [driver] = await pool.query('SELECT license_expiry FROM drivers WHERE driver_id = ?', [driverId]);
        
        if (driver.length === 0) {
            return { valid: false, message: 'Driver not found' };
        }
        
        const expiryDate = new Date(driver[0].license_expiry);
        const today = new Date();
        
        return {
            valid: expiryDate >= today,
            expiry_date: driver[0].license_expiry,
            days_remaining: Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)),
            message: expiryDate >= today ? 'License is valid' : 'License has expired'
        };
    },

    // Check if vehicle is in active status
    checkVehicleActive: async (vehicleId) => {
        const [vehicle] = await pool.query('SELECT status FROM vehicles WHERE vehicle_id = ?', [vehicleId]);
        
        if (vehicle.length === 0) {
            return { active: false, message: 'Vehicle not found' };
        }
        
        return {
            active: vehicle[0].status === 'active',
            status: vehicle[0].status,
            message: vehicle[0].status === 'active' ? 'Vehicle is active' : `Vehicle is ${vehicle[0].status}`
        };
    },

    // Comprehensive trip conflict check
    checkAllConflicts: async (tripData) => {
        const { driver_id, vehicle_id, trip_date, trip_time, expected_passenger_count } = tripData;
        
        const conflicts = {
            has_conflicts: false,
            driver_available: true,
            vehicle_available: true,
            driver_hours_weekly: true,
            driver_hours_daily: true,
            vehicle_capacity: true,
            license_valid: true,
            vehicle_active: true,
            details: []
        };
        
        // Check driver availability
        const driverAvail = await ConflictDetectionService.checkDriverAvailability(driver_id, trip_date, trip_time);
        if (!driverAvail.available) {
            conflicts.has_conflicts = true;
            conflicts.driver_available = false;
            conflicts.details.push({
                type: 'driver_conflict',
                message: `Driver has a conflicting trip at ${driverAvail.conflicts[0]?.trip_time}`
            });
        }
        
        // Check vehicle availability
        const vehicleAvail = await ConflictDetectionService.checkVehicleAvailability(vehicle_id, trip_date, trip_time);
        if (!vehicleAvail.available) {
            conflicts.has_conflicts = true;
            conflicts.vehicle_available = false;
            conflicts.details.push({
                type: 'vehicle_conflict',
                message: `Vehicle has a conflicting trip at ${vehicleAvail.conflicts[0]?.trip_time}`
            });
        }
        
        // Check driver weekly hours
        const weeklyHours = await ConflictDetectionService.checkDriverWeeklyHours(driver_id, trip_date);
        if (weeklyHours.would_exceed) {
            conflicts.has_conflicts = true;
            conflicts.driver_hours_weekly = false;
            conflicts.details.push({
                type: 'weekly_hours',
                message: `Driver would exceed weekly hour limit (${weeklyHours.current_hours} + 2 > 48)`
            });
        }
        
        // Check driver daily hours
        const dailyHours = await ConflictDetectionService.checkDriverDailyHours(driver_id, trip_date);
        if (dailyHours.would_exceed) {
            conflicts.has_conflicts = true;
            conflicts.driver_hours_daily = false;
            conflicts.details.push({
                type: 'daily_hours',
                message: `Driver would exceed daily hour limit (${dailyHours.current_hours} + 2 > 8)`
            });
        }
        
        // Check vehicle capacity
        const capacity = await ConflictDetectionService.checkVehicleCapacity(vehicle_id, expected_passenger_count);
        if (!capacity.sufficient) {
            conflicts.has_conflicts = true;
            conflicts.vehicle_capacity = false;
            conflicts.details.push({
                type: 'capacity',
                message: capacity.message
            });
        }
        
        // Check license validity
        const license = await ConflictDetectionService.checkDriverLicenseValid(driver_id);
        if (!license.valid) {
            conflicts.has_conflicts = true;
            conflicts.license_valid = false;
            conflicts.details.push({
                type: 'license_expired',
                message: license.message
            });
        }
        
        // Check vehicle active status
        const active = await ConflictDetectionService.checkVehicleActive(vehicle_id);
        if (!active.active) {
            conflicts.has_conflicts = true;
            conflicts.vehicle_active = false;
            conflicts.details.push({
                type: 'vehicle_inactive',
                message: active.message
            });
        }
        
        return conflicts;
    }
};

module.exports = ConflictDetectionService;