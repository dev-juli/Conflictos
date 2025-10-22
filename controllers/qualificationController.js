import * as service from '../services/qualificationService.js';

export const obtener = async (req, res) => {
  try {
    const cal = await service.obtenerPorId(req.params.id);
    if (!cal) return res.status(404).json({ message: 'No encontrada' });
    res.json(cal);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const listarPorEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    const { año } = req.query;
    const list = await service.listarPorEstudiante(estudianteId, año);
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const listarPorGrupo = async (req, res) => {
  try {
    const { grupoId } = req.params;
    const { año } = req.query;
    const list = await service.listarPorGrupo(grupoId, año);
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const listarPorGrupoYMateria = async (req, res) => {
  try {
    const { grupoId, materiaId } = req.params;
    const { año } = req.query;
    const data = await service.listarPorGrupoYMateria(grupoId, materiaId, año);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listarFinalesPorAño = async (req, res) => {
  try {
    const { año } = req.params;
    const data = await service.listarFinalesPorAño(año);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listarFinalesPorEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    const { año } = req.query;
    const data = await service.listarFinalesPorEstudiante(estudianteId, año);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listarFinalesPorGrupo = async (req, res) => {
  try {
    const { grupoId } = req.params;
    const { año } = req.query;
    const data = await service.listarFinalesPorGrupo(grupoId, año);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const crear = async (req, res) => {
  try {
    const data = req.body;

    // Por ahora, permitimos que secretaria cree notas
    // En el futuro: validar si req.user.rol === 'profesor' y pertenece a la materia/grupo
    data.registradoPor = req.user?._id || data.registradoPor;
    const created = await service.crear(data);
    res.status(201).json(created);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const crearLote = async (req, res) => {
  try {
    const arr = req.body; // array de calificaciones
    const result = await service.crearLote(arr);
    res.status(201).json(result);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const generarFinales = async (req, res) => {
  try {
    const { colegioId, año, grupoId } = req.body;
    const resultados = await service.generarFinales({ colegioId, año, grupoId });
    res.json({ count: resultados.length, resultados });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const actualizar = async (req, res) => {
  try {
    const updated = await service.actualizar(req.params.id, req.body);
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


export const actualizarFinal = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    const updated = await service.actualizarFinal(id, cambios);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
