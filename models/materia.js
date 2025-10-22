import mongoose from "mongoose";

const materiaSchema = new mongoose.Schema(
  {
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    esIndependiente: {
      type: Boolean,
      required: true,
    },
    porcentajeArea: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    intensidadHoraria: {
      type: Number,
      required: true,
      min: 1,
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Materia", materiaSchema);
