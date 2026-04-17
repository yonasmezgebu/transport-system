const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
    path.join(__dirname, '../../uploads'),
    path.join(__dirname, '../../uploads/incidents'),
    path.join(__dirname, '../../uploads/documents'),
    path.join(__dirname, '../../uploads/profiles')
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = path.join(__dirname, '../../uploads');
        
        // Determine upload folder based on file type or route
        if (req.baseUrl.includes('/incidents') || req.path.includes('incident')) {
            uploadPath = path.join(__dirname, '../../uploads/incidents');
        } else if (req.baseUrl.includes('/documents') || req.path.includes('document')) {
            uploadPath = path.join(__dirname, '../../uploads/documents');
        } else if (req.baseUrl.includes('/profile')) {
            uploadPath = path.join(__dirname, '../../uploads/profiles');
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// File filter for images
const imageFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
    }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and image files are allowed'), false);
    }
};

// Configure multer for incident photos
const uploadIncidentPhoto = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5
    },
    fileFilter: imageFilter
});

// Configure multer for documents
const uploadDocument = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1
    },
    fileFilter: documentFilter
});

// Configure multer for profile pictures
const uploadProfilePicture = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
        files: 1
    },
    fileFilter: imageFilter
});

// Generic upload for single file
const uploadSingle = (fieldName) => {
    return multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: imageFilter
    }).single(fieldName);
};

// Generic upload for multiple files
const uploadMultiple = (fieldName, maxCount = 5) => {
    return multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: imageFilter
    }).array(fieldName, maxCount);
};

module.exports = {
    uploadIncidentPhoto,
    uploadDocument,
    uploadProfilePicture,
    uploadSingle,
    uploadMultiple
};