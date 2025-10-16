import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const usuarioColegioSchema = new Schema({
  tipoIdentificacion: {
    type: String,
    enum: ['CC', 'TI', 'CE', 'PP'],
    required: true
  },
  numeroIdentificacion: {
    type: String,
    required: true,
    unique: true
  },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: false }, // Ya no es único ni obligatorio
  contraseña: { type: String, required: true },
  rol: {
    type: String,
    enum: ['rector', 'coordinador', 'secretaria', 'profesor', 'acudiente', 'estudiante'],
    required: true
  },
  colegio: { type: Schema.Types.ObjectId, ref: 'Colegio', required: false },
}, { timestamps: true });

// Encriptar contraseña antes de guardar
usuarioColegioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

// Comparar contraseñas
usuarioColegioSchema.methods.compararContraseña = async function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.contraseña);
};

export default model('UsuariosColegio', usuarioColegioSchema);

