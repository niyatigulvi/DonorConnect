const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "niyati@8585",
    database: "donorconnect"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
    } else {
        console.log("MySQL connected successfully!");
    }
});
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "DonorConnect Backend Server is Running!"
    });
});
app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    res.json({
        success: true,
        message: "Registration successful!"
    });
});
// Get all donations
app.get('/api/donations', (req, res) => {
    const sql = 'SELECT * FROM donations';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching donations:', err);
            return res.status(500).json({
                error: 'Failed to fetch donations'
            });
        }

        res.json(results);
    });
});

// Login API
app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, results) => {

        if (err) {
            console.log("Login Database Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Login failed"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful!",
            user: results[0]
        });
    });
});
app.post("/api/donations", (req, res) => {

    const {
        user_id,
        category,
        item_name,
        description,
        quantity,
        condition,
        location
    } = req.body;

    if (!user_id || !category || !item_name || !description || !quantity || !condition || !location) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const fullDescription = `${description} | Condition: ${condition}`;

    const sql = `
        INSERT INTO donations
        (user_id, category, item_name, description, quantity, location)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, category, item_name, fullDescription, quantity, location],
        (err, result) => {

            if (err) {
                console.log("Donation Database Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Donation failed"
                });
            }

            res.json({
                success: true,
                message: "Donation submitted successfully!"
            });
        }
    );
});
// ==============================
// REQUEST API
// ==============================

app.post("/api/requests", (req, res) => {

    const {
        donation_id,
        requester_id,
        message
    } = req.body;

    if (!donation_id || !requester_id) {
        return res.status(400).json({
            success: false,
            message: "Donation ID and requester ID are required"
        });
    }

    const sql = `
        INSERT INTO requests
        (donation_id, requester_id, message, status)
        VALUES (?, ?, ?, 'pending')
    `;

    db.query(
        sql,
        [donation_id, requester_id, message || null],
        (err, result) => {

            if (err) {
                console.log("Request Database Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Request failed"
                });
            }

            res.json({
                success: true,
                message: "Request submitted successfully!",
                requestId: result.insertId
            });
        }
    );
});


// ==============================
// ADMIN - GET ALL REQUESTS
// ==============================

app.get("/api/admin/requests", (req, res) => {

    const sql = `
        SELECT
            r.id,
            r.donation_id,
            r.requester_id,
            r.message,
            r.status
        FROM requests r
        ORDER BY r.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Get Requests Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch requests"
            });
        }

        res.json({
            success: true,
            requests: results
        });
    });
});
// ==============================
// GET MY REQUESTS
// ==============================

app.get("/api/requests/:requester_id", (req, res) => {

    const requesterId = req.params.requester_id;

    const sql = `
        SELECT
            r.id,
            r.donation_id,
            r.requester_id,
            r.message,
            r.status,
            r.created_at,
            d.item_name,
            d.category,
            d.quantity
        FROM requests r
        LEFT JOIN donations d
            ON r.donation_id = d.id
        WHERE r.requester_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(sql, [requesterId], (err, results) => {

        if (err) {
            console.log("Get Requests Database Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch requests"
            });
        }

        res.json({
            success: true,
            requests: results
        });
    });
});
// ==============================
// ADMIN - APPROVE / REJECT REQUEST
// ==============================

app.put("/api/admin/requests/:id", (req, res) => {

    const requestId = req.params.id;
    const { status } = req.body;

    if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }

    const sql = `
        UPDATE requests
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, requestId], (err, result) => {

        if (err) {
            console.log("Update Request Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to update request"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        res.json({
            success: true,
            message: `Request ${status} successfully!`
        });
    });
});
// ==============================
// ADMIN - GET ALL USERS
// ==============================

app.get("/api/admin/users", (req, res) => {

    const sql = `
        SELECT id, name, email
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Get Users Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch users"
            });
        }

        res.json({
            success: true,
            users: results
        });
    });
});
// ==============================
// ADMIN - REPORTS / STATISTICS
// ==============================

app.get("/api/admin/reports", (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT COUNT(*) FROM donations) AS totalDonations,
            (SELECT COUNT(*) FROM requests) AS totalRequests,
            (SELECT COUNT(*) FROM donations WHERE status = 'Available') AS availableDonations
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Reports Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch reports"
            });
        }

        res.json({
            success: true,
            reports: results[0]
        });
    });
});
app.listen(PORT, () => {
    console.log(`DonorConnect server running on http://localhost:${PORT}`);
});

