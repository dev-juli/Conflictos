import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

// Importación de rutas
import periodsRoutes from './routes/periods.js';
import direccionNucleoRoutes from './routes/coreDirectionRoutes.js';
import colegiosRoutes from './routes/Colegio.js';
import headquartersRoutes from './routes/headquarters.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas principales
app.use('/api', direccionNucleoRoutes);
app.use('/api', colegiosRoutes);
app.use('/api/sedes', headquartersRoutes);
app.use('/api/periodos', periodsRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('🛑 Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB conectado correctamente'))
  .catch((err) => console.error('❌ Error al conectar con MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
