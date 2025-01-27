const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    price: { type: float, required: true, unique: true },
    calories: { type: int, required: true, unique: true }
})
module.exports = mongoose.model("User", boatSchema)