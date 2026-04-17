const isTransportManager = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role_name !== 'transport_manager') {
        return res.status(403).json({ error: 'Transport Manager access required' });
    }
    next();
};

const isFleetOfficer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role_name !== 'fleet_officer') {
        return res.status(403).json({ error: 'Fleet Officer access required' });
    }
    next();
};

const isDriver = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role_name !== 'driver') {
        return res.status(403).json({ error: 'Driver access required' });
    }
    next();
};

const isStaff = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!['staff', 'department_head', 'transport_manager'].includes(req.user.role_name)) {
        return res.status(403).json({ error: 'Staff access required' });
    }
    next();
};

const isStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role_name !== 'student') {
        return res.status(403).json({ error: 'Student access required' });
    }
    next();
};

const isGateGuard = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role_name !== 'gate_guard') {
        return res.status(403).json({ error: 'Gate Guard access required' });
    }
    next();
};

const isUniversityAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role_name !== 'university_admin') {
        return res.status(403).json({ error: 'University Admin access required' });
    }
    next();
};

const isDepartmentHead = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role_name !== 'department_head') {
        return res.status(403).json({ error: 'Department Head access required' });
    }
    next();
};

// This is the authorize function that userRoutes.js is trying to use
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        if (!allowedRoles.includes(req.user.role_name)) {
            return res.status(403).json({ 
                error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
                your_role: req.user.role_name
            });
        }
        
        next();
    };
};

const checkOwnership = (getResourceUserId) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        if (['transport_manager', 'university_admin'].includes(req.user.role_name)) {
            return next();
        }
        
        const resourceUserId = await getResourceUserId(req);
        if (req.user.user_id !== resourceUserId) {
            return res.status(403).json({ error: 'You can only access your own resources' });
        }
        
        next();
    };
};

module.exports = { 
    isTransportManager, 
    isFleetOfficer, 
    isDriver, 
    isStaff, 
    isStudent, 
    isGateGuard, 
    isUniversityAdmin,
    isDepartmentHead,
    authorize,  // Make sure authorize is exported
    checkOwnership
};