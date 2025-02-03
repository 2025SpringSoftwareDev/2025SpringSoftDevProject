const express = require('express');
const router = express.Router();
const path = require('path');

// This is how we connect to a pug view
router.get('/', (req, res) => {
    res.render('index'); //from index
});

// This is how we connect to  a html page
// router.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/HTML/homepage.html'));
// });

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