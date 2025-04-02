const mongoose = require("mongoose");

const menuItem = require("../models/menuItem")
const account = require("../models/accounts")

const orderSchema = mongoose.Schema({
    menuItems: [{
        items: String,
        quantity: Number
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    time: {type: Date, required: true},

})

module.exports = mongoose.model("Order", orderSchema);
