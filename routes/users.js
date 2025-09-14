// backend/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all users
router.get("/", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// GET user by ID
router.get("/:id", (req, res) => {
    db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "success", data: row });
    });
});

// CREATE new user
router.post("/", (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role) return res.status(400).json({ error: "All fields are required" });

    const sql = "INSERT INTO users (name, email, role) VALUES (?, ?, ?)";
    db.run(sql, [name, email, role], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User created", data: { id: this.lastID, name, email, role } });
    });
});

// UPDATE user
router.put("/:id", (req, res) => {
    const { name, email, role } = req.body;
    const sql = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
    db.run(sql, [name, email, role, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User updated", changes: this.changes });
    });
});

// DELETE user
router.delete("/:id", (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User deleted", changes: this.changes });
    });
});

module.exports = router;
