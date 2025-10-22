import express from 'express';
import { registrar, login, perfil } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Registro de usuario
router.post('/register', registrar);

// Login
router.post('/login', login);

// Obtener perfil
router.get('/profile', auth, perfil);

export default router;
