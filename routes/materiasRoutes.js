// routes/materias.js
import { Router } from 'express';
import * as materiasCtrl from '../controllers/materiasController.js';

const router = Router();

router.get('/', materiasCtrl.getAll);
router.get('/:id', materiasCtrl.getById);
router.post('/', materiasCtrl.create);
router.put('/:id', materiasCtrl.update);
router.delete('/:id', materiasCtrl.remove);

// (Opcional) también expones /api/materias/area/:id si lo quieres:
/*
router.get('/area/:id', materiasCtrl.getByArea);
*/

export default router;
