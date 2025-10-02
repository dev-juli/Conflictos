// routes/materias.js
import { Router } from 'express';
import * as materiasCtrl from '../controllers/materiasController.js';

const router = Router();

// Listar todas las materias
router.get('/', materiasCtrl.getAll);
// Obtener una materia por ID
router.get('/:id', materiasCtrl.getById);

// Crear materia
router.post('/', materiasCtrl.create);

// Actualizar materia
router.put('/:id', materiasCtrl.update);

// Listar materias por área
router.get('/area/:id', materiasCtrl.getByArea);

// Activar materia
router.put('/:id/activar', materiasCtrl.activate);

// Desactivar materia
router.put('/:id/desactivar', materiasCtrl.deactivate);

export default router;
