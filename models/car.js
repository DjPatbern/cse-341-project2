const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  year: {
    type: Number,
    required: true,
    min: [1886, "Year must be valid"]
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);
