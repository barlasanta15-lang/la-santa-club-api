const express = require("express");
const Inventario = require("../models/Inventario");
const Venta = require("../models/Venta");

const router = express.Router();

router.get("/", async (req, res) => {
  const ventas = await Venta.find().sort({ fecha: -1 });
  res.json(ventas);
});

router.post("/", async (req, res) => {
  const { productos, metodoPago, precio } = req.body;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ mensaje: "No hay productos" });
  }

  if (!metodoPago) {
    return res.status(400).json({ mensaje: "Método de pago requerido" });
  }

  if (!precio || precio <= 0) {
    return res.status(400).json({ mensaje: "Precio requerido" });
  }

  for (const producto of productos) {
    const item = await Inventario.findOne({ nombre: producto.nombre });

    if (!item || item.stock <= 0) {
      return res.status(400).json({
        mensaje: `No hay stock disponible para ${producto.nombre}`,
      });
    }

    item.stock -= 1;
    await item.save();
  }

  const venta = await Venta.create({
    productos,
    metodoPago,
    precio,
  });

  res.json({
    mensaje: "Venta registrada correctamente",
    venta,
  });
});
router.post("/manuales", async (req, res) => {
  const { texto } = req.body;

  if (!texto || texto.trim() === "") {
    return res.status(400).json({ mensaje: "Texto vacío" });
  }

  const lineas = texto.trim().split("\n");
  const ventasCreadas = [];

  for (const linea of lineas) {
    const partes = linea.trim().split(/\s+/);

    const precio = Number(partes.pop());
    const metodoPago = partes.pop();

    if (!metodoPago || isNaN(precio) || precio <= 0) continue;

    const nombre = partes.join(" ").toUpperCase();

    const item = await Inventario.findOne({ nombre });

    if (!item || item.stock <= 0) {
      continue;
    }

    item.stock -= 1;
    await item.save();

    const venta = await Venta.create({
      productos: [{ nombre }],
      metodoPago:
        metodoPago.toLowerCase() === "efectivo"
          ? "Efectivo"
          : "Transferencia",
      precio,
    });

    ventasCreadas.push(venta);
  }

  res.json({
    mensaje: "Ventas manuales registradas",
    cantidad: ventasCreadas.length,
    ventas: ventasCreadas,
  });
});

module.exports = router;