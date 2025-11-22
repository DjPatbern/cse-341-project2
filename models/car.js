const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1886 },
  price: { type: Number, required: true, min: 0 },
  type: { type: String, required: true },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
  fuel: { type: String, required: true },
  horsepower: { type: Number, required: true, min: 1 },
  mileage: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
