const express = require("express");
const router = express.Router();
const User = require("../models/accounts");
const Menu = require("../models/menuItem");

function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
}
function employeeOnly(req, res, next) {
    requireAuth(req, res, () => {
        if (!["employee", "supervisor", "admin"].includes(req.session.role)) {
            return res.status(403).send("Access Denied");
        }
        next();
    });
}

function supervisorOnly(req, res, next) {
    requireAuth(req, res, () => {
        if (!["supervisor", "admin"].includes(req.session.role)) {
            return res.status(403).send("Supervisors Only");
        }
        next();
    });
}

function adminOnly(req, res, next) {
    requireAuth(req, res, () => {
        if (req.session.role !== "admin") {
            return res.status(403).send("Admins Only");
        }
        next();
    });
}

// Add a new menu item
router.post("/menu", async (req, res) => {
    try {
        const menuItem = new Menu(req.body);
        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Use Menu.find() to retrieve all info in JSON format
router.get("/menu", async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/api/accounts", adminOnly, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Ensure role is valid
        const validRoles = ["customer", "employee", "supervisor", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role selected." });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to DB
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        console.error("User Creation Error:", error);
        res.status(500).json({ error: "Error creating user." });
    }
});

module.exports = router;


// UNROLL THE TADPOLE 
// UNCLOG THE FROG 
// UNLOAD THE TOAD 
// UNINHIBIT THE RIBBIT 
// UNSTICK THE LICK 
// UNIMPRISON THE AMPHIBIAN 
// UNMUTE THE NEWT 
// PERMIT THE KERMIT 
// DEFOG THE POLLIWOG 

// **UNBENCH THE KENCH**
        