const express = require("express");
const router = express.Router();
const User = require("../models/accounts");
const Menu = require("../models/menuItem");

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


module.exports = router;
