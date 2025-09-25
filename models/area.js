const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  activa: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Area', areaSchema);
