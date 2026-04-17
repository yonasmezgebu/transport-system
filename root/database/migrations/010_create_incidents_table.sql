SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS incident_reports (
    incident_id INT PRIMARY KEY AUTO_INCREMENT,
    driver_id INT NOT NULL,
    trip_id INT NULL,
    type ENUM('traffic', 'road_damage', 'mechanical', 'breakdown') NOT NULL,
    location VARCHAR(200) NOT NULL,
    incident_date DATE NOT NULL,
    incident_time TIME NOT NULL,
    description TEXT NOT NULL,
    status ENUM('draft', 'submitted') DEFAULT 'draft',
    submitted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE SET NULL
);

SET FOREIGN_KEY_CHECKS = 1;