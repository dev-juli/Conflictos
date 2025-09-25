const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB usando variable de entorno MONGO_URL
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB conectada!'))
.catch(err => console.error('Error conectando DB:', err));

// Importa las rutas
const areaRoutes = require('./routes/areaRoutes');

// Usa las rutas
app.use('/api/areas', areaRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
