const express = require('express');
const router = express.Router();
const path = require('path');

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

// This is how we connect to a pug view
// router.get('/', (req, res) => {
//     res.render('index');
// });

// This is how we connect to  a html page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/homepage.html'));
});

router.get('/customer', (req, res) => {
    res.render('customerDashboard');
});

router.get('/employee', (req, res) => {
    res.render('employeeDashboard');
});

// router.get('/signup', (req, res) => {
//     res.render('signup');
// });

// router.get('/login', (req, res) => {
//     res.render('login');
// });

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/signup.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/login.html'));
});


router.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/HTML/menu.html'));
});

router.get('/reservation', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/reservation.html'));
});

router.get('/catering', (req, res) => {
    res.render('catering');
})

router.get('/order', (req, res) => {
    res.render('order');
})

router.get('/addItem', supervisorOnly, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HTML/addMenuItem.html'));
});

module.exports = router;