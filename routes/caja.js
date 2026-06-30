const express = require("express");
const Venta = require("../models/Venta");
const CajaCierre = require("../models/CajaCierre");

const router = express.Router();

async function calcularCajaActual() {
  const ultimoCierre = await CajaCierre.findOne().sort({ fechaCierre: -1 });

  const filtro = ultimoCierre
    ? { fecha: { $gt: ultimoCierre.fechaCierre } }
    : {};

  const ventas = await Venta.find(filtro);

  const totalEfectivo = ventas
    .filter((v) => v.metodoPago === "Efectivo")
    .reduce((sum, v) => sum + (v.precio || 0), 0);

  const totalTransferencia = ventas
    .filter((v) => v.metodoPago === "Transferencia")
    .reduce((sum, v) => sum + (v.precio || 0), 0);

  return {
    cantidadVentas: ventas.length,
    totalEfectivo,
    totalTransferencia,
    totalGeneral: totalEfectivo + totalTransferencia,
  };
}

router.get("/", async (req, res) => {
  const caja = await calcularCajaActual();
  res.json(caja);
});

router.post("/cerrar", async (req, res) => {
  const caja = await calcularCajaActual();

  const cierre = await CajaCierre.create(caja);

  res.json({
    mensaje: "Caja cerrada correctamente",
    cierre,
  });
});

router.get("/cierres", async (req, res) => {
  const cierres = await CajaCierre.find().sort({ fechaCierre: -1 });
  res.json(cierres);
});

module.exports = router;