const mongoose = require("mongoose");

const menuItemSchema = mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    calories: { type: Number, required: true }
});

module.exports = mongoose.model("Menu", menuItemSchema);
