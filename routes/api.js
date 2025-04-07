const express = require("express");
const router = express.Router();
const User = require("../models/accounts");
const Menu = require("../models/menuItem");
const Reservation = require("../models/reservations");
const bcrypt = require("bcrypt");

// Middleware functions for role-based access
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

// Public routes
router.get("/menu", async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User routes
router.post("/reservations", requireAuth, async (req, res) => {
  try {
    const { date, time, guests, requests } = req.body;
    const user = await User.findById(req.session.userId);
    
    if (!user) return res.status(404).json({ error: "User not found" });

    const newReservation = new Reservation({
      userId: user._id,
      name: user.name,
      email: user.email,
      date,
      time,
      guests,
      requests,
    });

    await newReservation.save();
    res.status(201).json({ message: "Reservation successful!" });
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/reservations", requireAuth, async (req, res) => {
  try {
    const userReservations = await Reservation.find({ userId: req.session.userId })
      .sort({ date: 1, time: 1 });
    res.status(200).json(userReservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({ error: "Error fetching reservations" });
  }
});

// Supervisor routes
router.post("/menu", supervisorOnly, async (req, res) => {
  try {
    const menuItem = new Menu(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/menu/:id", supervisorOnly, async (req, res) => {
  try {
    const { available } = req.body;
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { available },
      { new: true }
    );
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ error: "Error updating menu item." });
  }
});

router.delete("/menu/:id", supervisorOnly, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting menu item." });
  }
});

// Admin routes
router.get("/accounts", adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users." });
  }
});

router.post("/accounts", adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user." });
  }
});

router.delete("/accounts/:id", adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user." });
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
