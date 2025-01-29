const express = require('express');
const router = express.Router();

// Handle the root route
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/customer', (req, res) => {
    res.render('customerDashboard');
});

router.get('/employee', (req, res) => {
    res.render('employeeDashboard');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;