const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    role: {
        type: String,
        enum: ["customer", "employee", "supervisor", "admin"],
        required: true
    }
})
module.exports = mongoose.model("user", userSchema)