// controllers/authController.js
import UsuariosColegio from '../models/usersSchool.js';
import jwt from 'jsonwebtoken';

// Generar token JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Registrar usuario
export const registrar = async (req, res) => {
  try {
    const {
      tipoIdentificacion,
      numeroIdentificacion,
      nombre,
      apellido,
      correo,
      contraseña,
      rol,
      colegio
    } = req.body;

    // Validar duplicado por número de identificación
    const existe = await UsuariosColegio.findOne({ numeroIdentificacion });
    if (existe) return res.status(400).json({ message: 'Ya existe un usuario con ese número de identificación' });

    const nuevoUsuario = await UsuariosColegio.create({
      tipoIdentificacion,
      numeroIdentificacion,
      nombre,
      apellido,
      correo,
      contraseña,
      rol,
      colegio
    });

    const token = generarToken(nuevoUsuario._id);

    res.status(201).json({
      message: 'Usuario creado con éxito',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
        numeroIdentificacion: nuevoUsuario.numeroIdentificacion,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { numeroIdentificacion, contraseña } = req.body;
    const usuario = await UsuariosColegio.findOne({ numeroIdentificacion });
    if (!usuario) return res.status(400).json({ message: 'Usuario no encontrado' });

    const esValida = await usuario.compararContraseña(contraseña);
    if (!esValida) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = generarToken(usuario._id);

    res.json({
      message: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        numeroIdentificacion: usuario.numeroIdentificacion
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Perfil del usuario autenticado
export const perfil = async (req, res) => {
  res.json(req.user);
};

