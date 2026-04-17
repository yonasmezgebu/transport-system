SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS trip_assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    driver_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    UNIQUE KEY unique_trip (trip_id)
);

SET FOREIGN_KEY_CHECKS = 1;