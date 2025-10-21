import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import direccionNucleoRoutes from './routes/coreDirectionRoutes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', direccionNucleoRoutes);

// Middleware para manejo de errores básico (opcional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto y escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error de conexión MongoDB:', err));
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import colegios from "./routes/Colegio.js";

const app = express();

// Middleware para permitir que Express entienda 
app.use(express.json());


app.use(colegios);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => console.error("Error al conectar a la base de datos:", error));
});
