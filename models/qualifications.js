import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CalificacionSchema = new Schema({
    colegio: { type: Schema.Types.ObjectId, ref: 'Colegio', required: true },
    estudiante: { type: Schema.Types.ObjectId, ref: 'UsuariosColegio', required: true },
    materia: { type: Schema.Types.ObjectId, ref: 'Materia', required: true },
    grupo: { type: Schema.Types.ObjectId, ref: 'Grupo', required: true },
    periodo: { type: Schema.Types.ObjectId, ref: 'Periodo', default: null }, // null para nota final
    año: { type: Number, required: true },
    tipoNota: { type: String, enum: ['PERIODO', 'FINAL'], required: true },
    nota: { type: Number, required: true },
    juicioValorativo: { type: String, default: '' },
    fallas: { type: Number, default: 0 },
    observaciones: { type: String, default: '' },
    fechaRegistro: { type: Date, default: Date.now },
    registradoPor: { type: Schema.Types.ObjectId, ref: 'UsuariosColegio' },
}, { timestamps: true });

CalificacionSchema.index({ estudiante: 1, materia: 1, periodo: 1, año: 1 }, { unique: false });

export default model('Calificacion', CalificacionSchema);

