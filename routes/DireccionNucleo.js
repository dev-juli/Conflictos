import express from 'express';
import * as coreDirectionCtrl from '../controllers/DireccionNucleo.js';

const router = express.Router();

router.get('/core-directions', coreDirectionCtrl.getAll);
// Comentado si no usas aún:
// router.get('/core-directions/:id', coreDirectionCtrl.getById);
router.post('/core-directions', coreDirectionCtrl.create);
router.post('/core-directions/login', coreDirectionCtrl.login);
router.put('/core-directions/:id', coreDirectionCtrl.update);
router.put('/core-directions/:id/change-password', coreDirectionCtrl.changePassword);
router.delete('/core-directions/:id', coreDirectionCtrl.remove);
router.put('/core-directions/:id/activate', coreDirectionCtrl.activate);
router.put('/core-directions/:id/deactivate', coreDirectionCtrl.deactivate);

export default router;
