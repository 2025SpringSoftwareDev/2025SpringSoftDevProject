const express = require("express");
const router = express.Router();
const User = require("../models/accounts");
const Menu = require("../models/menuItem");
const Reservation = require("../models/reservations");
const Order = require("../models/order");
const bcrypt = require("bcrypt");

// lock routes to require an account access
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

// lock routes to require employee access
function employeeOnly(req, res, next) {
  requireAuth(req, res, () => {
    if (!["employee", "supervisor", "admin"].includes(req.session.role)) {
      return res.status(403).send("Access Denied");
    }
    next();
  });
}

// lock routes to require supervisor access
function supervisorOnly(req, res, next) {
  requireAuth(req, res, () => {
    if (!["supervisor", "admin"].includes(req.session.role)) {
      return res.status(403).send("Supervisors Only");
    }
    next();
  });
}

// lock routes to require admin access
function adminOnly(req, res, next) {
  requireAuth(req, res, () => {
    if (req.session.role !== "admin") {
      return res.status(403).send("Admins Only");
    }
    next();
  });
}

//
// end of functions
//

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

//
// user required
//

router.post("/reservations", requireAuth, async (req, res) => {
  try {
    const { date, time, guests, requests } = req.body;

    // Ensure user is logged in
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // Fetch user info (since name/email are not input fields)
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Create and save reservation
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


router.post("/cart", async (req, res) =>{
  try{  
    console.log("Received request body:", req.body); // Debugging step

    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid." });
    }

    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // Fetch user info (since name/email are not input fields)
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const orderMap = new Map();
    cart.forEach(item => orderMap.set(item.name, item.quantity));
    const orderObject = Object.fromEntries(orderMap);

    const newOrder = new Order({
      items: cart.reduce((acc, item) => {
        acc[item.name] = item.quantity;
        return acc;
      }, {}),
      userId: user.id,
    });
    await newOrder.save();
    console.log("Order successfully saved:", newOrder);

    res.json({ message: "Order successfully placed!", orderId: newOrder._id });
  } catch (error) {
    console.error("Order Error", error);
    res.status(500).json({ error: "Error Purchasing Cart." });
  }
});

// Use reservations.find() to retrieve all info in JSON format
router.get("/reservations", async (req, res) => {
  try {
    const ReservationItems = await Reservation.find();
    res.status(200).json(ReservationItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//
// Supervisor requried
//

// Update menu item availability
router.patch("/menu/:id", async (req, res) => {
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

// Delete menu item
router.delete("/menu/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting menu item." });
  }
});

//
// Admin required
//

// Get all users, Admin
router.get("/accounts", adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "name email role"); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users." });
  }
});

// Create a new user, Admin
router.post("/accounts", adminOnly, async (req, res) => {
  try {
    console.log("Received data:", req.body);

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

// Delete a user, Admin
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
