const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create and export promise pool directly
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'transport-system',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
}).promise();

module.exports = pool;