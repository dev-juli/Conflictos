import express from 'express';
import * as areaController from '../controllers/areaController.js';

const router = express.Router();

router.get('/', areaController.getAll);
router.get('/:id', areaController.getById);
router.post('/', areaController.create);
router.put('/:id', areaController.update);
router.delete('/:id', areaController.remove);
router.put('/:id/activar', areaController.activar);
router.put('/:id/desactivar', areaController.desactivar);

export default router;
