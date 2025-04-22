const express = require("express");
const router = express.Router();
const User = require("../models/accounts");
const Menu = require("../models/menuItem");
const Reservation = require("../models/reservations");
const Order = require("../models/order");
const bcrypt = require("bcrypt");

// Middleware functions for role-based access
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
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

router.post("/cart", async (req, res) =>{
  try{  
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

    res.json({ message: "Order successfully placed!", orderId: newOrder._id });
  } catch (error) {
    console.error("Order Error", error);
    res.status(500).json({ error: "Error Purchasing Cart." });
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

// Use reservations.find() to retrieve all info in JSON format
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

// i dont remember what or why this is
router.get("/auth/check", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("name email role");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ 
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Error checking auth:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Supervisor routes

// Get all reservations
router.get("/reservations", supervisorOnly, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .sort({ date: 1, time: 1 }); // sort by date and time

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Error fetching reservations" });
  }
});


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

router.get("/orders", supervisorOnly, async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate("userId", "name email") // optional: populate user's name & email
      .sort({ time: -1 }); // latest orders first

    res.status(200).json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// Admin routes
router.get("/accounts", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only admin can see all users
    if (user.role === "admin") {
      const users = await User.find({}, "name email role");
      return res.json(users);
    }
    
    // Supervisor can see employees and customers
    if (user.role === "supervisor") {
      const users = await User.find(
        { role: { $in: ["employee", "customer"] } },
        "name email role"
      );
      return res.json(users);
    }

    // Regular users can only see their own info
    res.json([{ name: user.name, email: user.email, role: user.role }]);
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
