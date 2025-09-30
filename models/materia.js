// models/materia.js
import mongoose from 'mongoose';

const materiaSchema = new mongoose.Schema({
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true }, // ref a Area
  nombre: { type: String, required: true, trim: true },
  codigo: { type: String, required: true, unique: true, trim: true },
  esIndependiente: { type: Boolean, required: true }, // true = calificación independiente
  porcentajeArea: { type: Number, min: 0, max: 100, default: null },
  intensidadHoraria: { type: Number, default: 0 },
  activa: { type: Boolean, default: true }
}, { timestamps: true });

// índice opcional para evitar duplicar nombre dentro de la misma área
materiaSchema.index({ area: 1, nombre: 1 }, { unique: true });

export default mongoose.model('Materia', materiaSchema);
