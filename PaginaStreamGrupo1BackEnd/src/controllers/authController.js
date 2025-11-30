const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Registrar usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Completa todos los campos para continuar' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Este usuario ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        puntos: 0,
        monedas: 500 // Monedas iniciales
      }
    });

    // Generar token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret_key_temporal',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '¡Cuenta creada! Ya puedes empezar a ver streams',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        puntos: user.puntos,
        monedas: user.monedas,
        isStreamer: user.isStreamer
      },
      token
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: 'Ingresa tu email y contraseña' });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret_key_temporal',
      { expiresIn: '7d' }
    );

    res.json({
      message: '¡Bienvenido de vuelta!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        puntos: user.puntos,
        monedas: user.monedas,
        isStreamer: user.isStreamer,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        puntos: true,
        monedas: true,
        isStreamer: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        streamer: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar puntos
exports.updatePoints = async (req, res) => {
  try {
    const { puntos } = req.body;

    if (typeof puntos !== 'number') {
      return res.status(400).json({ error: 'Puntos inválidos' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'No encontramos tu cuenta' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { puntos: user.puntos + puntos }
    });

    res.json({
      message: `+${puntos} puntos`,
      puntos: updatedUser.puntos
    });
  } catch (error) {
    console.error('Error en updatePoints:', error);
    res.status(500).json({ error: 'Error al actualizar puntos' });
  }
};
