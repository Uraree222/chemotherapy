require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
        }

        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
            return res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        req.session.userId = users[0].id;
        req.session.username = users[0].username;
        res.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// GET endpoint to fetch all patients
app.get('/api/patients', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM patients ORDER BY appointment_date DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message });
    }
});

// POST endpoint to add a new patient
app.post('/api/patients', async (req, res) => {
    try {
        const { patient_name, hn, phone_number, diagnosis, appointment_date, next_cycle } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO patients (patient_name, hn, phone_number, diagnosis, appointment_date, next_cycle) VALUES (?, ?, ?, ?, ?, ?)',
            [patient_name, hn, phone_number, diagnosis, appointment_date, next_cycle]
        );
        
        res.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ' });
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
