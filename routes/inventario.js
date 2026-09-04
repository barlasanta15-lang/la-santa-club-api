const express = require("express");
const Inventario = require("../models/Inventario");

const router = express.Router();

router.patch("/:id/restar", async (req, res) => {
  try {
    const producto = await Inventario.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    if (producto.stock <= 0) {
      return res.status(400).json({
        mensaje: "El producto ya está agotado",
      });
    }

    producto.stock -= 1;
    await producto.save();

    res.json({
      mensaje: "Se restó una unidad correctamente",
      producto,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al restar stock",
    });
  }
});

router.patch("/:id/sumar", async (req, res) => {
  try {
    const producto = await Inventario.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    producto.stock += 1;
    await producto.save();

    res.status(200).json({
      mensaje: "Se agregó una unidad correctamente",
      producto,
    });
  } catch (error) {
    console.error("Error al sumar stock:", error);

    res.status(500).json({
      mensaje: "Error al sumar stock",
    });
  }
});

function normalizarNombre(texto) {
  return texto
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

router.get("/", async (req, res) => {
  const inventario = await Inventario.find().sort({ nombre: 1 });
  res.json(inventario);
});

router.post("/carga-masiva", async (req, res) => {
  const { texto } = req.body;

  if (!texto || texto.trim() === "") {
    return res.status(400).json({ mensaje: "Texto vacío" });
  }

  const lineas = texto.trim().split("\n");

  for (const linea of lineas) {
    const partes = linea.trim().split(/\s+/);
    const cantidad = Number(partes.pop());
    const nombreOriginal = partes.join(" ");

    if (!nombreOriginal || isNaN(cantidad) || cantidad <= 0) {
      continue;
    }

    const nombreNormalizado = normalizarNombre(nombreOriginal);

    const productoExistente = await Inventario.findOne({
      nombre: nombreNormalizado,
    });

    if (productoExistente) {
      productoExistente.stock += cantidad;
      await productoExistente.save();
    } else {
      await Inventario.create({
        nombre: nombreNormalizado,
        stock: cantidad,
      });
    }
  }

  res.json({ mensaje: "Inventario cargado correctamente" });
});

router.delete("/:id", async (req, res) => {
  await Inventario.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Producto eliminado correctamente" });
});

module.exports = router;
