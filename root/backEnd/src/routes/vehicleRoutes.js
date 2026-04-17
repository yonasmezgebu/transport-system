const express = require('express');
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleMaintenance,
    getVehicleFuelLogs
} = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateVehicle, validateIdParam } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Authenticated routes (all authenticated users can view vehicles)
router.use(authenticate);

router.get('/', getAllVehicles);
router.get('/:id', validateIdParam, getVehicleById);
router.get('/:id/maintenance', validateIdParam, getVehicleMaintenance);
router.get('/:id/fuel-logs', validateIdParam, getVehicleFuelLogs);

// Fleet officer only routes
router.post('/', authorize('fleet_officer'), apiLimiter, validateVehicle, createVehicle);
router.put('/:id', authorize('fleet_officer'), validateIdParam, updateVehicle);
router.delete('/:id', authorize('fleet_officer'), validateIdParam, deleteVehicle);

module.exports = router;