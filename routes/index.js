const express = require("express");
const router = express.Router();
const path = require("path");

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
// End of functions
//

//
// no auth endpoints
//

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/homepage.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/signup.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/login.html"));
});

router.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/menu.html"));
});

//
// auth required
//

router.get("/User/catering", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/catering.html"));
});

router.get("/User/reservation", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/reservation.html"));
});

router.get("/User/cart", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/cart.html"));
});

//
// supervisor+ auth required
//

router.get("/controlPanel", supervisorOnly, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/HTML/controlPanel.html")
  );
});

router.get("/supervisor/menu", supervisorOnly, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/supervisorManageMenu.html"));
});

router.get("/supervisor/reservations", supervisorOnly, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/supervisorReservation.html"));
});

router.get("/supervisor/orders", supervisorOnly, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/supervisorOrders.html"));
});

//
// admin auth required
//

router.get("/admin/accounts", adminOnly, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/adminManageAccounts.html"));
});

module.exports = router;
