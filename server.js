const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const inventarioRoutes = require("./routes/inventario");
const ventasRoutes = require("./routes/ventas");
const cajaRoutes = require("./routes/caja");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/inventario", inventarioRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/caja", cajaRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API La Santa Club funcionando" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Servidor corriendo en puerto", process.env.PORT || 3000);
    });
  })
  .catch((error) => console.error("Error MongoDB:", error));