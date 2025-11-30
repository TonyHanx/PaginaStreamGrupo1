const prisma = require('../config/prisma');

// Obtener regalos predeterminados
exports.getDefaultGifts = async (req, res) => {
  try {
    const gifts = await prisma.gift.findMany({
      where: { esPredeterminado: true },
      orderBy: { precio: 'asc' }
    });

    res.json({ gifts });
  } catch (error) {
    console.error('Error en getDefaultGifts:', error);
    res.status(500).json({ error: 'Error al obtener regalos' });
  }
};

// Obtener regalos personalizados de un streamer
exports.getStreamerCustomGifts = async (req, res) => {
  try {
    const { streamerId } = req.params;

    const gifts = await prisma.gift.findMany({
      where: { 
        streamerId: parseInt(streamerId),
        esPredeterminado: false 
      },
      orderBy: { precio: 'asc' }
    });

    res.json({ gifts });
  } catch (error) {
    console.error('Error en getStreamerCustomGifts:', error);
    res.status(500).json({ error: 'Error al obtener regalos personalizados' });
  }
};

// Crear regalo personalizado (solo streamers)
exports.createCustomGift = async (req, res) => {
  try {
    const { nombre, precio, imagenUrl, puntos, color } = req.body;

    // Verificar si el usuario es streamer
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    if (!user || !user.isStreamer) {
      return res.status(403).json({ error: 'No tienes permisos de streamer' });
    }

    const streamer = await prisma.streamer.findFirst({
      where: { userId: req.userId }
    });
    if (!streamer) {
      return res.status(404).json({ error: 'Perfil de streamer no encontrado' });
    }

    const gift = await prisma.gift.create({
      data: {
        nombre,
        precio,
        imagenUrl,
        puntos,
        color,
        esPredeterminado: false,
        streamerId: streamer.id
      }
    });

    res.status(201).json({
      message: 'Regalo creado',
      gift
    });
  } catch (error) {
    console.error('Error en createCustomGift:', error);
    res.status(500).json({ error: 'Error al crear regalo personalizado' });
  }
};

// Enviar regalo
exports.sendGift = async (req, res) => {
  try {
    const { giftId, streamerId } = req.body;

    // Obtener usuario y regalo
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    const gift = await prisma.gift.findUnique({
      where: { id: giftId }
    });
    const streamer = await prisma.streamer.findUnique({
      where: { id: streamerId }
    });

    if (!user || !gift || !streamer) {
      return res.status(404).json({ error: 'Algo salió mal, intenta de nuevo' });
    }

    // Verificar que el usuario tenga suficientes monedas
    if (user.monedas < gift.precio) {
      return res.status(400).json({ error: 'No tienes monedas suficientes' });
    }

    // Realizar transacción usando Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar monedas y puntos del usuario
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          monedas: user.monedas - gift.precio,
          puntos: user.puntos + gift.puntos
        }
      });

      // Crear registro de transacción
      await tx.transaction.create({
        data: {
          userId: user.id,
          streamerId: streamer.id,
          giftId: gift.id,
          tipo: 'regalo',
          monto: gift.precio,
          descripcion: `Regalo ${gift.nombre} enviado a ${streamer.displayName}`
        }
      });

      return updatedUser;
    });

    res.json({
      message: `¡${gift.nombre} enviado!`,
      monedas: result.monedas,
      puntos: result.puntos
    });
  } catch (error) {
    console.error('Error en sendGift:', error);
    res.status(500).json({ error: 'Error al enviar regalo' });
  }
};

// Comprar monedas
exports.buyCoins = async (req, res) => {
  try {
    const { cantidad } = req.body;

    if (typeof cantidad !== 'number' || cantidad <= 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    if (!user) {
      return res.status(404).json({ error: 'Sesión expirada' });
    }

    // Realizar transacción usando Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar monedas del usuario
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          monedas: user.monedas + cantidad
        }
      });

      // Crear registro de transacción
      await tx.transaction.create({
        data: {
          userId: user.id,
          tipo: 'compra_monedas',
          monto: cantidad,
          descripcion: `Compra de ${cantidad} monedas`
        }
      });

      return updatedUser;
    });

    res.json({
      message: `+${cantidad} monedas agregadas`,
      monedas: result.monedas
    });
  } catch (error) {
    console.error('Error en buyCoins:', error);
    res.status(500).json({ error: 'Error al comprar monedas' });
  }
};

// Obtener balance del usuario
exports.getBalance = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        monedas: true,
        puntos: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Sesión expirada' });
    }

    res.json({
      monedas: user.monedas,
      puntos: user.puntos
    });
  } catch (error) {
    console.error('Error en getBalance:', error);
    res.status(500).json({ error: 'Error al obtener balance' });
  }
};

// Obtener historial de transacciones
exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId },
      include: {
        streamer: {
          select: {
            displayName: true
          }
        },
        gift: {
          select: {
            nombre: true,
            emoji: true,
            imagenUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Error en getTransactionHistory:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};
