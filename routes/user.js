const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Import User model
const Employee = require("../models/employee"); // Import Employee model

router.post("/signup", async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging

        const { name, email, password, role } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password || !role) {
            return res.status(400).send("All fields are required");
        }

        if (role === "customer") {
            // Create a new User
            const newUser = new User({ name, email, password });
            await newUser.save();
            console.log("Customer registered:", newUser);
        } else if (role === "employee") {
            // Create a new Employee
            const newEmployee = new Employee({ name, email, password, admin: false }); // Default admin to false
            await newEmployee.save();
            console.log("Employee registered:", newEmployee);
        } else {
            return res.status(400).send("Invalid role");
        }

        res.redirect("/"); // Redirect after successful signup
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).send("Error registering user");
    }
});

module.exports = router;
