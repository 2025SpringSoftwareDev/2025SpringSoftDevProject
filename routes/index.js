const express = require('express');
const router = express.Router();

// Handle the root route
router.get('/', (req, res) => {
    res.render('index', { title: 'Work in Progress', message: 'Work in progress' });
});

module.exports = router;