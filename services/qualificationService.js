import Calificacion from '../models/qualifications.js';
// import Periodo from '../models/period.js';
// import CargaAcademica from '../models/academicLoad.js';
// import Materia from '../models/subject.js';
import mongoose from 'mongoose';

export const crear = async (data) => {
  const created = await Calificacion.create(data);
  return created;
};

export const crearLote = async (calificacionesArray) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const docs = await Calificacion.insertMany(calificacionesArray, { session });
    await session.commitTransaction();
    session.endSession();
    return docs;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/**
 * Generar notas finales automáticamente para un año y (opcional) grupo o colegio.
 * Estrategia básica:
 *  - Para cada estudiante+materia calcular promedio ponderado por porcentajes de períodos (Periodo.porcentaje)
 *  - Si la materia NO es independiente y la institución usa porcentajes por materia dentro del área,
 *    la lógica ideal es: calcular nota final del área (sum(materia_final * cargaAcademica.porcentaje/100))
 *  - Aquí implementamos: calcular materia_final por períodos; si quieres area_final, se hace en otro endpoint/report.
 */
export const generarFinales = async ({ colegioId, año, grupoId = null }) => {
  // 1) obtener periodos del año con sus porcentajes
  const periodos = await Periodo.find({ colegio: colegioId, año }).lean();
  const periodosMap = {};
  let sumaPorcentajes = 0;
  periodos.forEach(p => {
    const pct = p.porcentaje ?? 0;
    periodosMap[p._id.toString()] = pct;
    sumaPorcentajes += pct;
  });
  if (sumaPorcentajes === 0) {
    // evitar division por cero; asumimos igual peso entre periodos si no hay porcentajes
    const equalPct = 100 / (periodos.length || 1);
    periodos.forEach(p => { periodosMap[p._id.toString()] = equalPct; });
    sumaPorcentajes = 100;
  }

  // 2) buscar calificaciones tipo PERIODO para el año y filtros
  const match = { año, tipoNota: 'PERIODO', colegio: colegioId };
  if (grupoId) match.grupo = grupoId;

  const periodoCalifs = await Calificacion.find(match)
    .select('estudiante materia periodo nota')
    .lean();

  // Agrupar por estudiante + materia
  const agrup = {};
  for (const c of periodoCalifs) {
    const key = `${c.estudiante}_${c.materia}`;
    agrup[key] = agrup[key] || { estudiante: c.estudiante, materia: c.materia, sumWeighted: 0, sumPct: 0 };
    const pct = periodosMap[(c.periodo || '').toString()] ?? 0;
    agrup[key].sumWeighted += (c.nota ?? 0) * (pct/100);
    agrup[key].sumPct += pct;
  }

  // 3) crear/actualizar calificaciones tipo FINAL
  const results = [];
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const key of Object.keys(agrup)) {
      const item = agrup[key];
      const norma = item.sumPct || 100;
      const notaFinal = (item.sumWeighted / (norma/100));
      const finalObj = {
        colegio: colegioId,
        estudiante: item.estudiante,
        materia: item.materia,
        grupo: null, // opcionalmente buscar grupo más frecuente o recibir por parámetro
        periodo: null,
        año,
        tipoNota: 'FINAL',
        nota: Number(notaFinal.toFixed(2)),
        juicioValorativo: '',
        fechaRegistro: new Date(),
      };
      // upsert: buscar si ya existe nota final para ese estudiante+materia+año
      const filtro = { estudiante: item.estudiante, materia: item.materia, año, tipoNota: 'FINAL', colegio: colegioId };
      if (grupoId) filtro.grupo = grupoId;
      const updated = await Calificacion.findOneAndUpdate(filtro, finalObj, { upsert: true, new: true, session, setDefaultsOnInsert: true });
      results.push(updated);
    }
    await session.commitTransaction();
    session.endSession();
    return results;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const actualizar = async (id, cambios) => {
  return Calificacion.findByIdAndUpdate(id, cambios, { new: true });
};

export const obtenerPorId = async (id) => {
  return Calificacion.findById(id).populate('estudiante materia periodo registradoPor grupo colegio');
};

export const listarPorEstudiante = async (estudianteId, año) => {
  const q = { estudiante: estudianteId };
  if (año) q.año = año;
  return Calificacion.find(q).populate('materia periodo grupo colegio').sort({ año: -1, tipoNota: 1 });
};

export const listarPorGrupo = async (grupoId, año) => {
  const q = { grupo: grupoId };
  if (año) q.año = año;
  return Calificacion.find(q).populate('estudiante materia periodo').sort({ 'materia': 1 });
};

export const listarPorGrupoYMateria = async (grupoId, materiaId, año) => {
  const query = { grupo: grupoId, materia: materiaId };
  if (año) query.año = año;
  return Calificacion.find(query)
    .populate('estudiante materia periodo grupo colegio')
    .sort({ 'estudiante': 1 });
};

export const listarFinalesPorAño = async (año) => {
  return Calificacion.find({ año, tipoNota: 'FINAL' })
    .populate('estudiante materia grupo colegio')
    .sort({ grupo: 1, estudiante: 1 });
};

export const listarFinalesPorEstudiante = async (estudianteId, año) => {
  const q = { estudiante: estudianteId, tipoNota: 'FINAL' };
  if (año) q.año = año;
  return Calificacion.find(q)
    .populate('materia grupo colegio')
    .sort({ año: -1 });
};

export const listarFinalesPorGrupo = async (grupoId, año) => {
  const q = { grupo: grupoId, tipoNota: 'FINAL' };
  if (año) q.año = año;
  return Calificacion.find(q)
    .populate('estudiante materia colegio')
    .sort({ 'estudiante': 1 });
};

export const actualizarFinal = async (id, cambios) => {
  return Calificacion.findOneAndUpdate(
    { _id: id, tipoNota: 'FINAL' },
    cambios,
    { new: true }
  );
};
