// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import materiasRoutes from "./routes/materiasRoutes.js";
import areaRoutes from "./routes/areaRoutes.js"; // <-- ya convertido a ES Modules

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/materias", materiasRoutes);
app.use("/api/areas", areaRoutes);

// Middleware de errores
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ success: false, message: "Error interno del servidor" });
});

// Configuración del servidor y conexión a MongoDB
const PORT = process.env.PORT || 3000;
console.log("🔍 MONGO_URL:", process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));
