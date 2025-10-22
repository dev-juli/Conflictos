import express from 'express';
import * as controller from '../controllers/qualificationController.js';
import auth from '../middlewares/auth.js';
import roleCheck from '../middlewares/roleCheck.js';

const router = express.Router();


//  Reglas de acceso según documento:
//  Rector, Coordinador: solo pueden listar (GET)
//  Secretaria: puede hacer todo (GET, POST, PUT)
 

// Obtener calificación por ID
router.get('/:id', auth, roleCheck(['rector', 'coordinador', 'secretaria']), controller.obtener);

// Calificaciones por estudiante
router.get('/estudiantes/:estudianteId/calificaciones',
  auth, roleCheck(['rector', 'coordinador', 'secretaria']),
  controller.listarPorEstudiante
);

// Calificaciones por grupo
router.get('/grupos/:grupoId/calificaciones',
  auth, roleCheck(['rector', 'coordinador', 'secretaria']),
  controller.listarPorGrupo
);

// Calificaciones por grupo y materia
router.get('/grupos/:grupoId/materias/:materiaId/calificaciones',
  auth, roleCheck(['rector', 'coordinador', 'secretaria']),
  controller.listarPorGrupoYMateria
);

// Listar todas las notas finales por año
router.get('/finales/:año',
  auth, roleCheck(['rector', 'coordinador', 'secretaria']),
  controller.listarFinalesPorAño
);

// Notas finales por estudiante (por año)
router.get('/estudiantes/:estudianteId/calificaciones/finales',
  auth, roleCheck(['rector', 'coordinador', 'secretaria']),
  controller.listarFinalesPorEstudiante
);

// Notas finales por grupo
router.get('/grupos/:grupoId/calificaciones/finales',
  auth, roleCheck(['rector', 'coordinador', 'secretaria']),
  controller.listarFinalesPorGrupo
);

// Crear calificación
router.post('/',
  auth, roleCheck(['secretaria']),
  controller.crear
);

// Crear múltiples calificaciones (lote)
router.post('/lote',
  auth, roleCheck(['secretaria']),
  controller.crearLote
);

// Generar notas finales automáticamente
router.post('/generar-finales',
  auth, roleCheck(['secretaria']),
  controller.generarFinales
);

// Actualizar calificación (de período)
router.put('/:id',
  auth, roleCheck(['secretaria']),
  controller.actualizar
);

// Actualizar nota final
router.put('/finales/:id',
  auth, roleCheck(['secretaria']),
  controller.actualizarFinal
);

export default router;
