// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import areasRouter from './routes/areas.js';
import materiasRouter from './routes/materias.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/areas', areasRouter);
app.use('/api/materias', materiasRouter);

// Middleware errores (simple)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// Conexión a Mongo y arranque
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error('❌ Falta MONGO_URL en .env');
  process.exit(1);
}

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });
