import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import materiaRoutes from './routes/subjects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// 🧩 Middlewares globales
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas
app.use('/api/materias', materiaRoutes);

// Ruta raíz simple para probar servidor
app.get('/', (req, res) => {
  res.send('API de Materias funcionando');
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
