CREATE DATABASE IF NOT EXISTS chemotherapy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE chemotherapy_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- เพิ่มผู้ใช้เริ่มต้น (รหัสผ่าน: admin123)
INSERT INTO users (username, password) VALUES 
('admin', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOxgxhD66BEEPYXc1Z7GHX6qJGf9h9AFi');

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    hn VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15),
    diagnosis VARCHAR(255),
    appointment_date DATE NOT NULL,
    next_cycle VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
