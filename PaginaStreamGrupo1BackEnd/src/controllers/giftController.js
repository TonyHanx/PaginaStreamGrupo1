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
        streamerId: streamerId, // streamerId es un UUID, no un número
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
    const { nombre, precio, imagenUrl, audioUrl, puntos, color } = req.body;
    
    console.log('📝 [createCustomGift] Datos recibidos:', { nombre, precio, imagenUrl, audioUrl, puntos, color });

    // Verificar si el usuario es streamer
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { streamer: true }
    });
    
    console.log('👤 [createCustomGift] Usuario encontrado:', user?.username, 'isStreamer:', user?.isStreamer);
    
    if (!user || !user.isStreamer) {
      return res.status(403).json({ error: 'No tienes permisos de streamer' });
    }

    // Si no tiene perfil de streamer, crearlo automáticamente
    let streamer = user.streamer;
    if (!streamer) {
      console.log('⚠️ Usuario sin perfil de streamer, creando automáticamente...');
      streamer = await prisma.streamer.create({
        data: {
          userId: req.userId,
          displayName: user.username,
          description: `Canal de ${user.username}`
        }
      });
      console.log('✅ Perfil de streamer creado:', streamer.id);
      
      // Actualizar isStreamer si no está marcado
      if (!user.isStreamer) {
        await prisma.user.update({
          where: { id: req.userId },
          data: { isStreamer: true }
        });
      }
    }
    
    console.log('🎁 [createCustomGift] StreamerId:', streamer.id);

    const giftData = {
      nombre,
      precio: parseInt(precio),
      imagenUrl: imagenUrl || null,
      audioUrl: audioUrl || null,
      puntos: parseInt(puntos),
      color: color || '#ffffff',
      esPredeterminado: false,
      streamerId: streamer.id
    };
    
    console.log('💾 [createCustomGift] Datos a guardar:', giftData);

    const gift = await prisma.gift.create({
      data: giftData
    });
    
    console.log('✅ [createCustomGift] Regalo creado exitosamente:', gift.id);

    // Dar XP por crear regalo personalizado (50 XP)
    const xpGanado = 50;
    const nuevoXP = user.xp + xpGanado;
    const xpPorNivel = 100;
    const nuevoNivel = Math.floor(nuevoXP / xpPorNivel) + 1;

    await prisma.user.update({
      where: { id: user.id },
      data: { xp: nuevoXP, nivel: nuevoNivel }
    });

    // Sincronizar con perfil de streamer
    await prisma.streamer.update({
      where: { id: streamer.id },
      data: { xp: nuevoXP, nivel: nuevoNivel }
    });

    res.status(201).json({
      message: 'Regalo creado',
      gift,
      xpGanado,
      nivel: nuevoNivel,
      subiDeNivel: nuevoNivel > user.nivel
    });
  } catch (error) {
    console.error('❌ [createCustomGift] Error completo:', error);
    console.error('❌ [createCustomGift] Error message:', error.message);
    console.error('❌ [createCustomGift] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al crear regalo personalizado',
      details: error.message 
    });
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
      // Calcular XP ganado basado en los puntos del regalo
      // Los puntos del regalo se convierten directamente en XP
      const xpGanado = gift.puntos;
      const nuevoXP = user.xp + xpGanado;
      const xpPorNivel = 100;
      const nuevoNivel = Math.floor(nuevoXP / xpPorNivel) + 1;

      // Actualizar monedas, puntos, XP y nivel del usuario
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          monedas: user.monedas - gift.precio,
          puntos: user.puntos + gift.puntos,
          xp: nuevoXP,
          nivel: nuevoNivel
        }
      });

      // Si el usuario es streamer, sincronizar XP y nivel
      const userStreamer = await tx.streamer.findUnique({ where: { userId: user.id } });
      if (userStreamer) {
        await tx.streamer.update({
          where: { id: userStreamer.id },
          data: { xp: nuevoXP, nivel: nuevoNivel }
        });
      }

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

      return { user: updatedUser, xpGanado, subiDeNivel: nuevoNivel > user.nivel };
    });

    res.json({
      message: `¡${gift.nombre} enviado!`,
      monedas: result.user.monedas,
      puntos: result.user.puntos,
      xp: result.user.xp,
      nivel: result.user.nivel,
      xpGanado: result.xpGanado,
      subiDeNivel: result.subiDeNivel
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
      // Calcular XP ganado (5 XP por cada 100 monedas)
      const xpGanado = Math.floor(cantidad / 100) * 5;
      const nuevoXP = user.xp + xpGanado;
      const xpPorNivel = 100;
      const nuevoNivel = Math.floor(nuevoXP / xpPorNivel) + 1;

      // Actualizar monedas, XP y nivel del usuario
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          monedas: user.monedas + cantidad,
          xp: nuevoXP,
          nivel: nuevoNivel
        }
      });

      // Si el usuario es streamer, sincronizar XP y nivel
      const userStreamer = await tx.streamer.findUnique({ where: { userId: user.id } });
      if (userStreamer) {
        await tx.streamer.update({
          where: { id: userStreamer.id },
          data: { xp: nuevoXP, nivel: nuevoNivel }
        });
      }

      // Crear registro de transacción
      await tx.transaction.create({
        data: {
          userId: user.id,
          tipo: 'compra_monedas',
          monto: cantidad,
          descripcion: `Compra de ${cantidad} monedas`
        }
      });

      return { user: updatedUser, xpGanado, subiDeNivel: nuevoNivel > user.nivel };
    });

    res.json({
      message: `+${cantidad} monedas agregadas`,
      monedas: result.user.monedas,
      xp: result.user.xp,
      nivel: result.user.nivel,
      xpGanado: result.xpGanado,
      subiDeNivel: result.subiDeNivel
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
