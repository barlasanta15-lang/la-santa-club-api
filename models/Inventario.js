const mongoose = require("mongoose");

const inventarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Inventario", inventarioSchema);