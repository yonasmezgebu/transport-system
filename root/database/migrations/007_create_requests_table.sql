CREATE TABLE IF NOT EXISTS department_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    department_head_id INT NOT NULL,
    purpose TEXT NOT NULL,
    requested_date DATE NOT NULL,
    requested_time TIME NOT NULL,
    passenger_count INT NOT NULL,
    destination VARCHAR(200) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'scheduled') DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_head_id) REFERENCES users(user_id) ON DELETE CASCADE
);