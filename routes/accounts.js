
const express = require("express");
const User = require("../models/accounts");

const router = express.Router();

// Signup Route (Handles POST request from signup form)
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Ensure role is valid
        const validRoles = ["customer", "employee", "supervisor", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).send("Invalid role selected.");
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.redirect("/login");
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Error creating user.");
    }
});

router.post("/login", (req, res) => {
    res.send("Login functionality will go here.");
});

module.exports = router;
