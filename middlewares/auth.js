import jwt from 'jsonwebtoken';
import UsuariosColegio from '../models/usersSchool.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token no proporcionado o inválido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UsuariosColegio.findById(decoded.id).select('-contraseña');
    if (!req.user) return res.status(401).json({ message: 'Usuario no encontrado' });
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido o expirado' });
  }
};

export default auth;
