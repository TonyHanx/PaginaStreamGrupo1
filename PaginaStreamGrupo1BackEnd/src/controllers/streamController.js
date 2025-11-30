const prisma = require('../config/prisma');

// Obtener todos los streamers
exports.getAllStreamers = async (req, res) => {
  try {
    const streamers = await prisma.streamer.findMany({
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { followers: 'desc' }
    });

    res.json({ streamers });
  } catch (error) {
    console.error('Error en getAllStreamers:', error);
    res.status(500).json({ error: 'Error al obtener streamers' });
  }
};

// Obtener streamer por ID
exports.getStreamerById = async (req, res) => {
  try {
    const { id } = req.params;

    const streamer = await prisma.streamer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
      }
    });

    if (!streamer) {
      return res.status(404).json({ error: 'Streamer no encontrado' });
    }

    res.json({ streamer });
  } catch (error) {
    console.error('Error en getStreamerById:', error);
    res.status(500).json({ error: 'Error al obtener streamer' });
  }
};

// Obtener todos los streams activos
exports.getActiveStreams = async (req, res) => {
  try {
    const streams = await prisma.stream.findMany({
      where: { isActive: true },
      include: {
        streamer: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { viewers: 'desc' }
    });

    res.json({ streams });
  } catch (error) {
    console.error('Error en getActiveStreams:', error);
    res.status(500).json({ error: 'Error al obtener streams activos' });
  }
};

// Obtener streams por categoría
exports.getStreamsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const streams = await prisma.stream.findMany({
      where: { 
        isActive: true,
        category: category
      },
      include: {
        streamer: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { viewers: 'desc' }
    });

    res.json({ streams });
  } catch (error) {
    console.error('Error en getStreamsByCategory:', error);
    res.status(500).json({ error: 'Error al obtener streams por categoría' });
  }
};

// Crear o actualizar stream
exports.createOrUpdateStream = async (req, res) => {
  try {
    const { title, category, game, thumbnail, language, tags, isMature } = req.body;

    // Verificar si el usuario es streamer
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.isStreamer) {
      return res.status(403).json({ error: 'Solo los streamers pueden hacer esto' });
    }

    const streamer = await prisma.streamer.findUnique({ where: { userId: req.userId } });
    if (!streamer) {
      return res.status(404).json({ error: 'Perfil no configurado' });
    }

    // Buscar stream activo del streamer
    let stream = await prisma.stream.findFirst({
      where: { streamerId: streamer.id, isActive: true }
    });

    if (stream) {
      // Actualizar stream existente
      stream = await prisma.stream.update({
        where: { id: stream.id },
        data: {
          title,
          category,
          game,
          thumbnail,
          language,
          tags,
          isMature
        }
      });
    } else {
      // Crear nuevo stream
      stream = await prisma.stream.create({
        data: {
          streamerId: streamer.id,
          title,
          category,
          game,
          thumbnail,
          language: language || 'Español',
          tags: tags || [],
          isMature: isMature || false,
          startedAt: new Date(),
          isActive: true
        }
      });

      // Actualizar estado del streamer
      await prisma.streamer.update({
        where: { id: streamer.id },
        data: { isLive: true }
      });
    }

    res.json({
      message: 'Stream actualizado',
      stream
    });
  } catch (error) {
    console.error('Error en createOrUpdateStream:', error);
    res.status(500).json({ error: 'Error al crear/actualizar stream' });
  }
};

// Finalizar stream
exports.endStream = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.isStreamer) {
      return res.status(403).json({ error: 'No tienes permisos de streamer' });
    }

    const streamer = await prisma.streamer.findUnique({ where: { userId: req.userId } });
    if (!streamer) {
      return res.status(404).json({ error: 'Perfil de streamer no encontrado' });
    }

    const stream = await prisma.stream.findFirst({
      where: { streamerId: streamer.id, isActive: true }
    });

    if (!stream) {
      return res.status(404).json({ error: 'No hay ningún stream activo' });
    }

    await prisma.stream.update({
      where: { id: stream.id },
      data: {
        isActive: false,
        endedAt: new Date()
      }
    });

    await prisma.streamer.update({
      where: { id: streamer.id },
      data: { isLive: false }
    });

    res.json({ message: 'Stream finalizado. ¡Gracias por transmitir!' });
  } catch (error) {
    console.error('Error en endStream:', error);
    res.status(500).json({ error: 'Error al finalizar stream' });
  }
};
