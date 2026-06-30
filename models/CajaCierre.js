const mongoose = require("mongoose");

const cajaCierreSchema = new mongoose.Schema({
  cantidadVentas: Number,
  totalEfectivo: Number,
  totalTransferencia: Number,
  totalGeneral: Number,
  fechaCierre: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CajaCierre", cajaCierreSchema);