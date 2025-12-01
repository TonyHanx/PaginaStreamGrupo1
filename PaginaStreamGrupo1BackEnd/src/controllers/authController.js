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

    // Crear usuario con perfil de streamer automáticamente
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        puntos: 0,
        monedas: 500, // Monedas iniciales
        isStreamer: true, // Todos los usuarios pueden ser streamers
        streamer: {
          create: {
            displayName: username,
            description: `Canal de ${username}`
          }
        }
      },
      include: { streamer: true }
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
        nivel: user.nivel,
        xp: user.xp,
        isStreamer: user.isStreamer,
        streamerId: user.streamer?.id || null,
        streamerNivel: user.streamer?.nivel || 1,
        streamerXp: user.streamer?.xp || 0
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

    // Buscar usuario por email o username
    const user = await prisma.user.findFirst({ 
      where: {
        OR: [
          { email: email },
          { username: email } // El campo 'email' del request puede ser username también
        ]
      },
      include: { streamer: true }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Si no tiene perfil de streamer, crearlo automáticamente
    if (!user.streamer) {
      console.log('⚠️ Usuario sin perfil de streamer, creando automáticamente...');
      const streamer = await prisma.streamer.create({
        data: {
          userId: user.id,
          displayName: user.username,
          description: `Canal de ${user.username}`
        }
      });
      user.streamer = streamer;
      
      // Actualizar isStreamer
      await prisma.user.update({
        where: { id: user.id },
        data: { isStreamer: true }
      });
      console.log('✅ Perfil de streamer creado:', streamer.id);
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
        nivel: user.nivel,
        xp: user.xp,
        isStreamer: user.isStreamer,
        avatar: user.avatar,
        streamerId: user.streamer?.id || null,
        streamerNivel: user.streamer?.nivel || 1,
        streamerXp: user.streamer?.xp || 0
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
        nivel: true,
        xp: true,
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

// Convertir usuario en streamer
exports.becomeStreamer = async (req, res) => {
  try {
    const { displayName, description } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { streamer: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si ya es streamer, retornar el streamer existente
    if (user.streamer) {
      return res.json({
        message: 'Ya eres streamer',
        streamer: user.streamer
      });
    }

    // Actualizar isStreamer a true y crear perfil de streamer
    await prisma.user.update({
      where: { id: req.userId },
      data: { isStreamer: true }
    });

    // Crear perfil de streamer
    const streamer = await prisma.streamer.create({
      data: {
        userId: req.userId,
        displayName: displayName || user.username,
        description: description || `Canal de ${user.username}`
      }
    });

    res.json({
      message: '¡Ahora eres streamer!',
      streamer
    });
  } catch (error) {
    console.error('Error en becomeStreamer:', error);
    res.status(500).json({ error: 'Error al convertir en streamer' });
  }
};

// Actualizar XP y nivel del usuario
exports.updateXP = async (req, res) => {
  try {
    const { xp } = req.body;

    if (typeof xp !== 'number') {
      return res.status(400).json({ error: 'XP inválido' });
    }

    const user = await prisma.user.findUnique({ 
      where: { id: req.userId },
      include: { streamer: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const nuevoXP = user.xp + xp;
    const xpPorNivel = 100;
    const nuevoNivel = Math.floor(nuevoXP / xpPorNivel) + 1;

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { 
        xp: nuevoXP,
        nivel: nuevoNivel
      }
    });

    // Si es streamer, sincronizar nivel y xp en el perfil de streamer
    if (user.streamer) {
      await prisma.streamer.update({
        where: { id: user.streamer.id },
        data: {
          xp: nuevoXP,
          nivel: nuevoNivel
        }
      });
    }

    res.json({
      message: `+${xp} XP`,
      xp: updatedUser.xp,
      nivel: updatedUser.nivel,
      subiDeNivel: nuevoNivel > user.nivel
    });
  } catch (error) {
    console.error('Error en updateXP:', error);
    res.status(500).json({ error: 'Error al actualizar XP' });
  }
};
