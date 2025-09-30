// controllers/materiasController.js
import mongoose from 'mongoose';
import Materia from '../models/materia.js';
import Area from '../models/area.js';

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

function resp(res, status, success, message, data = null) {
  const payload = { success, message };
  if (data !== null) payload.data = data;
  return res.status(status).json(payload);
}

// GET /api/materias
export async function getAll(req, res) {
  try {
    const materias = await Materia.find({}).populate('area', 'nombre codigo').lean();
    return res.json({ success: true, data: materias });
  } catch (err) {
    console.error('❌ Error al listar materias:', err);
    return resp(res, 500, false, 'Error al listar materias');
  }
}

// GET /api/materias/:id
export async function getById(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return resp(res, 400, false, 'ID inválido');

    const materia = await Materia.findById(id).populate('area', 'nombre codigo').lean();
    if (!materia) return resp(res, 404, false, 'Materia no encontrada');
    return resp(res, 200, true, 'Materia encontrada', materia);
  } catch (err) {
    console.error('❌ Error al obtener materia:', err);
    return resp(res, 500, false, 'Error al obtener materia');
  }
}

// GET /api/areas/:id/materias  (también lo implementamos aquí por si se quiere llamar desde /api/areas)
export async function getByArea(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return resp(res, 400, false, 'ID de área inválido');

    const area = await Area.findById(id);
    if (!area) return resp(res, 404, false, 'Área no encontrada');

    const materias = await Materia.find({ area: id, activa: true }).populate('area', 'nombre codigo').lean();
    return resp(res, 200, true, 'Materias por área', materias);
  } catch (err) {
    console.error('❌ Error al obtener materias por área:', err);
    return resp(res, 500, false, 'Error al obtener materias por área');
  }
}

// POST /api/materias
export async function create(req, res) {
  try {
    const { area, nombre, codigo, esIndependiente, porcentajeArea, intensidadHoraria } = req.body;

    // campos obligatorios básicos
    if (!nombre || !codigo || typeof esIndependiente !== 'boolean') {
      return resp(res, 400, false, 'nombre, codigo y esIndependiente son obligatorios (esIndependiente debe ser boolean)');
    }

    // area obligatorio (según requerimiento)
    if (!area) {
      return resp(res, 400, false, 'area es obligatorio (id de Area)');
    }
    if (!isValidId(area)) return resp(res, 400, false, 'ID de area inválido');

    const areaExists = await Area.findById(area);
    if (!areaExists) return resp(res, 404, false, 'Área no encontrada');

    // reglas independiente/porcentaje
    if (esIndependiente && porcentajeArea !== undefined && porcentajeArea !== null) {
      return resp(res, 400, false, 'Materia independiente no debe tener porcentajeArea');
    }
    if (!esIndependiente) {
      if (porcentajeArea === null || porcentajeArea === undefined) {
        return resp(res, 400, false, 'porcentajeArea es obligatorio si la materia no es independiente');
      }
      if (typeof porcentajeArea !== 'number') return resp(res, 400, false, 'porcentajeArea debe ser un número');
      if (porcentajeArea < 0 || porcentajeArea > 100) return resp(res, 400, false, 'porcentajeArea debe estar entre 0 y 100');

      // Validación: la suma de porcentajes del área no debe superar 100
      const materiasArea = await Materia.find({ area: area, activa: true }).select('porcentajeArea');
      const sumaActual = materiasArea.reduce((s, m) => s + (m.porcentajeArea || 0), 0);
      if (sumaActual + porcentajeArea > 100) {
        return resp(res, 400, false, `La suma de porcentajes en el área excede 100 (actual: ${sumaActual}%)`);
      }
    }

    // crear
    const materia = new Materia({
      area,
      nombre,
      codigo,
      esIndependiente,
      porcentajeArea: esIndependiente ? null : porcentajeArea,
      intensidadHoraria: intensidadHoraria ?? 0,
      activa: true
    });

    await materia.save();
    const saved = await Materia.findById(materia._id).populate('area', 'nombre codigo').lean();
    return resp(res, 201, true, 'Materia creada', saved);
  } catch (err) {
    console.error('❌ Error al crear materia:', err);
    if (err.code === 11000) return resp(res, 409, false, 'Código de materia duplicado');
    return resp(res, 500, false, 'Error al crear materia');
  }
}

// PUT /api/materias/:id
export async function update(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return resp(res, 400, false, 'ID inválido');

    const materia = await Materia.findById(id);
    if (!materia) return resp(res, 404, false, 'Materia no encontrada');

    const { area, nombre, codigo, esIndependiente, porcentajeArea, intensidadHoraria } = req.body;

    // si se quiere cambiar el area, validar
    if (area !== undefined) {
      if (!isValidId(area)) return resp(res, 400, false, 'ID de area inválido');
      const areaExists = await Area.findById(area);
      if (!areaExists) return resp(res, 404, false, 'Área (nueva) no encontrada');
    }

    // validaciones de independiente/porcentaje
    if (esIndependiente === true && porcentajeArea !== undefined && porcentajeArea !== null) {
      return resp(res, 400, false, 'Materia independiente no debe tener porcentajeArea');
    }

    if (esIndependiente === false) {
      if (porcentajeArea === null || porcentajeArea === undefined) {
        return resp(res, 400, false, 'porcentajeArea es obligatorio si la materia no es independiente');
      }
      if (typeof porcentajeArea !== 'number') return resp(res, 400, false, 'porcentajeArea debe ser un número');
      if (porcentajeArea < 0 || porcentajeArea > 100) return resp(res, 400, false, 'porcentajeArea debe estar entre 0 y 100');
      // validar suma (excluir la materia actual)
      const areaIdToCheck = area ?? materia.area.toString();
      const materiasArea = await Materia.find({ area: areaIdToCheck, activa: true }).select('porcentajeArea _id');
      const sumaExcluding = materiasArea.reduce((s, m) => s + ((m._id.toString() === id) ? 0 : (m.porcentajeArea || 0)), 0);
      if (sumaExcluding + porcentajeArea > 100) {
        return resp(res, 400, false, `La suma de porcentajes en el área excede 100 (actual excluyendo esta: ${sumaExcluding}%)`);
      }
    }

    // aplicar cambios
    if (area !== undefined) materia.area = area;
    if (nombre !== undefined) materia.nombre = nombre;
    if (codigo !== undefined) materia.codigo = codigo;
    if (esIndependiente !== undefined) materia.esIndependiente = esIndependiente;
    if (intensidadHoraria !== undefined) materia.intensidadHoraria = intensidadHoraria;
    // porcentaje
    if (esIndependiente === true) {
      materia.porcentajeArea = null;
    } else if (porcentajeArea !== undefined) {
      materia.porcentajeArea = porcentajeArea;
    }

    await materia.save();
    const updated = await Materia.findById(id).populate('area', 'nombre codigo').lean();
    return resp(res, 200, true, 'Materia actualizada', updated);
  } catch (err) {
    console.error('❌ Error al actualizar materia:', err);
    if (err.code === 11000) return resp(res, 409, false, 'Código de materia duplicado');
    return resp(res, 500, false, 'Error al actualizar materia');
  }
}

// DELETE /api/materias/:id  (soft delete)
export async function remove(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return resp(res, 400, false, 'ID inválido');

    const materia = await Materia.findById(id);
    if (!materia) return resp(res, 404, false, 'Materia no encontrada');

    materia.activa = false;
    await materia.save();
    return resp(res, 200, true, 'Materia eliminada (soft delete)');
  } catch (err) {
    console.error('❌ Error al eliminar materia:', err);
    return resp(res, 500, false, 'Error al eliminar materia');
  }
}
