const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true },
  foundedYear: { type: Number, min: 1800 },
  ceo: { type: String },
  totalEmployees: { type: Number, min: 0 },
  headquarters: { type: String },
  website: { type: String },
  revenueUSD: { type: Number },
  activeModels: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Manufacturer', manufacturerSchema);
