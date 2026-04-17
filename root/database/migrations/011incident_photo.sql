CREATE TABLE IF NOT EXISTS incident_photos (
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    incident_id INT NOT NULL,
    photo_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incident_reports(incident_id) ON DELETE CASCADE
);