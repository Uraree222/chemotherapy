CREATE DATABASE IF NOT EXISTS chemotherapy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE chemotherapy_db;

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
