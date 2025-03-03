const mongoose = require("mongoose");

const menuItemSchema = mongoose.Schema({
    category: {type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    calories: { type: Number, required: true },
    imageUrl: {type: String, require: true }
});

module.exports = mongoose.model("Menu", menuItemSchema);
