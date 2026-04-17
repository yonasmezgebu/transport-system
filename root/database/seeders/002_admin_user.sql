INSERT IGNORE INTO users (email, password_hash, full_name, phone, role_id, is_active) 
SELECT 'admin@transport.com', '$2b$10$9tU3ZoFgKp7QqXJ5xZ5xOeW5xZ5xOeW5xZ5xOeW5xZ5xOeW5xZ5xOe', 'System Admin', '0912345678', role_id, 1
FROM roles WHERE role_name = 'university_admin';