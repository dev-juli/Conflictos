import Area from '../models/area.js';

// Obtener todas las áreas
export const getAll = async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener área por ID
export const getById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ error: 'Área no encontrada' });
    res.json(area);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
};

// Crear área
export const create = async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    res.status(201).json(area);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar área
export const update = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!area) return res.status(404).json({ error: 'Área no encontrada' });
    res.json(area);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar área
export const remove = async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ error: 'Área no encontrada' });
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
};

// Activar área
export const activar = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(
      req.params.id,
      { active: true, updatedAt: new Date() },
      { new: true }
    );
    if (!area) return res.status(404).json({ error: 'Área no encontrada' });
    res.json(area);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Desactivar área
export const desactivar = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(
      req.params.id,
      { active: false, updatedAt: new Date() },
      { new: true }
    );
    if (!area) return res.status(404).json({ error: 'Área no encontrada' });
    res.json(area);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
