// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Importar rutas
import materiasRoutes from "./routes/materiasRoutes.js";
import areaRoutes from "./routes/areaRoutes.js"; // <-- ya convertido a ES Modules

dotenv.config();

const app = express();

// 🧩 Middlewares globales
app.use(cors());
app.use(express.json());

// 🧭 Rutas principales
app.use("/api/materias", materiasRoutes);
app.use("/api/areas", areaRoutes);

// 🧪 Ruta de prueba raíz (para comprobar que el backend esté corriendo)
app.get("/", (req, res) => {
  res.send("✅ API de Administración Educativa - Servidor funcionando correctamente");
});

// ⚠️ Middleware de manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error("❌ Error detectado:", err);
  res.status(500).json({ success: false, message: "Error interno del servidor" });
});

// 🚀 Configuración del servidor y conexión a MongoDB
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URL;

// Verificar si la URL está configurada
if (!mongoURI) {
  console.error("❌ Error: No se encontró la variable MONGO_URL en el archivo .env");
  process.exit(1);
}

// Mostrar la URL de conexión (solo para depuración)
console.log("🔍 Conectando a MongoDB Atlas...");

// Conexión a MongoDB Atlas
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado exitosamente a MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB Atlas:", err.message);
    process.exit(1);
  });
