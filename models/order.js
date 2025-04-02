const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    items: { type: Map, of: Number },
    totalPrice: {type: Number},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    time: {type: Date, default: Date.now},

})

module.exports = mongoose.model("Order", orderSchema);
