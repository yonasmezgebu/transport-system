CREATE TABLE IF NOT EXISTS maintenance_records (
    maintenance_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    maintenance_date DATE NOT NULL,
    cost_etb DECIMAL(10,2) NOT NULL,
    mileage INT NOT NULL,
    description TEXT,
    next_due_date DATE,
    next_due_mileage INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
);