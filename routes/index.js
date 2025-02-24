const express = require('express');
const router = express.Router();
const path = require('path');

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

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/HTML/menu.html'));
});

router.get('/reservation', (req, res) => {
    res.render('reservation');
})

router.get('/catering', (req, res) => {
    res.render('catering');
})

router.get('/order', (req, res) => {
    res.render('order');
})


module.exports = router;