const express = require('express');
const router = express.Router();
const path = require('path');

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

// This is how we connect to a pug view
// router.get('/', (req, res) => {
//     res.render('index');
// });

// This is how we connect to  a html page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/homepage.html'));
});

// router.get('/customer', (req, res) => {
//     res.render('customerDashboard');
// });

// router.get('/employee', (req, res) => {
//     res.render('employeeDashboard');
// });

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/signup.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/login.html'));
});

router.get('/menu', (req, res) => {
  res.render('menu')
});

router.get('/catering', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/catering.html'));
})

// router.get('/order', (req, res) => {
//     res.render('order');
// });


//
// auth required
//

router.get('/reservation', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/reservation.html'));
});

router.get('/cart', requireAuth, (req, res) => {
    res.render('cart');
});

//
// employee+ auth required
//



//
// supervisor+ auth required
//

router.get('/editMenu', supervisorOnly, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/supervisorManageMenu.html'));
});

router.get('/viewReservation', supervisorOnly, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/supervisorReservation.html'));
});

//
// admin auth required
//

router.get('/accounts', adminOnly, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/adminManageAccounts.html'));
});

module.exports = router;