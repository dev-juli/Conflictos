import mongoose from "mongoose";
import Materia from "../models/materia.js";
import Area from "../models/area.js";

// Listar todas las materias
export const getAll = async (req, res) => {
  try {
    const materias = await Materia.find().populate("area", "nombre codigo");
    res.json({
      success: true,
      message: "Materias listadas correctamente",
      data: materias,
    });
  } catch (error) {
    console.error("❌ Error en getAll:", error);
    res.status(500).json({
      success: false,
      message: "Error al listar las materias",
    });
  }
};

// Obtener materia por ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar formato de ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "El ID proporcionado no es válido",
      });
    }

    const materia = await Materia.findById(id).populate("area", "nombre codigo");

    if (!materia) {
      return res.status(404).json({
        success: false,
        message: "Materia no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Materia obtenida correctamente",
      data: materia,
    });
  } catch (error) {
    console.error("❌ Error en getById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la materia",
    });
  }
};

// Obtener materias por área
export const getByArea = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar formato de ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "El ID de área no es válido",
      });
    }

    const materias = await Materia.find({ area: id }).populate("area", "nombre codigo");

    res.json({
      success: true,
      message: "Materias por área listadas correctamente",
      data: materias,
    });
  } catch (error) {
    console.error("❌ Error en getByArea:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las materias por área",
    });
  }
};

// Crear materia
export const create = async (req, res) => {
  try {
    const { area, nombre, codigo, esIndependiente, porcentajeArea, intensidadHoraria } = req.body;

    console.log("📥 Datos recibidos:", req.body);

    // Validar existencia del área
    if (!mongoose.Types.ObjectId.isValid(area)) {
      return res.status(400).json({
        success: false,
        message: "El ID de área no es válido",
      });
    }

    const existing = await Materia.findOne({ codigo });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Código de materia duplicado",
      });
    }

    // Validar porcentaje acumulado si no es independiente
    if (!esIndependiente) {
      const materiasArea = await Materia.find({ area, esIndependiente: false, activa: true });
      const total = materiasArea.reduce((sum, m) => sum + (m.porcentajeArea || 0), 0);

      console.log(`📊 Total actual del área (${area}) = ${total}%`);

      if (total + porcentajeArea > 100) {
        return res.status(400).json({
          success: false,
          message: `La suma de porcentajes en el área excede 100 (actual: ${total}%)`,
        });
      }
    }

    const materia = await Materia.create({
      area,
      nombre,
      codigo,
      esIndependiente,
      porcentajeArea: esIndependiente ? null : porcentajeArea,
      intensidadHoraria,
      activa: true,
    });

    res.status(201).json({
      success: true,
      message: "Materia creada correctamente",
      data: materia,
    });
  } catch (error) {
    console.error("❌ Error en create:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la materia",
    });
  }
};

//  Actualizar materia
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "El ID proporcionado no es válido",
      });
    }

    const materia = await Materia.findById(id);
    if (!materia) {
      return res.status(404).json({
        success: false,
        message: "Materia no encontrada",
      });
    }

    Object.assign(materia, req.body);
    await materia.save();

    res.json({
      success: true,
      message: "Materia actualizada correctamente",
      data: materia,
    });
  } catch (error) {
    console.error("❌ Error en update:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la materia",
    });
  }
};
// Activar materia
export const activate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "El ID proporcionado no es válido",
      });
    }

    const materia = await Materia.findByIdAndUpdate(id, { activa: true }, { new: true });
    if (!materia) {
      return res.status(404).json({
        success: false,
        message: "Materia no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Materia activada correctamente",
      data: materia,
    });
  } catch (error) {
    console.error("❌ Error en activate:", error);
    res.status(500).json({
      success: false,
      message: "Error al activar la materia",
    });
  }
};

// Desactivar materia
export const deactivate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "El ID proporcionado no es válido",
      });
    }

    const materia = await Materia.findByIdAndUpdate(id, { activa: false }, { new: true });
    if (!materia) {
      return res.status(404).json({
        success: false,
        message: "Materia no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Materia desactivada correctamente",
      data: materia,
    });
  } catch (error) {
    console.error("❌ Error en deactivate:", error);
    res.status(500).json({
      success: false,
      message: "Error al desactivar la materia",
    });
  }
};
//  Eliminar materia
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "El ID proporcionado no es válido",
      });
    }

    const materia = await Materia.findByIdAndDelete(id);
    if (!materia) {
      return res.status(404).json({
        success: false,
        message: "Materia no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Materia eliminada correctamente",
    });
  } catch (error) {
    console.error("❌ Error en remove:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la materia",
    });
  }
};
