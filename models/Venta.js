const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
  productos: [
    {
      nombre: String,
      cantidad: { type: Number, default: 1 },
    },
  ],
  metodoPago: {
    type: String,
    enum: ["Efectivo", "Transferencia"],
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Venta", ventaSchema);