const prisma = require('../config/prisma');

// Script para crear regalos predeterminados
const createDefaultGifts = async () => {
  const defaultGifts = [
    { nombre: "Estrella", precio: 5, emoji: "⭐", puntos: 5, esPredeterminado: true },
    { nombre: "Corazón", precio: 10, emoji: "💖", puntos: 10, esPredeterminado: true },
    { nombre: "Confeti", precio: 25, emoji: "🎉", puntos: 25, esPredeterminado: true },
    { nombre: "Fuego", precio: 50, emoji: "🔥", puntos: 50, esPredeterminado: true },
    { nombre: "Diamante", precio: 100, emoji: "💎", puntos: 100, esPredeterminado: true },
    { nombre: "Corona", precio: 200, emoji: "👑", puntos: 200, esPredeterminado: true },
    { nombre: "Cohete", precio: 500, emoji: "🚀", puntos: 500, esPredeterminado: true },
    { nombre: "Diana", precio: 1000, emoji: "🎯", puntos: 1000, esPredeterminado: true },
  ];

  try {
    for (const gift of defaultGifts) {
      const existing = await prisma.gift.findFirst({
        where: { nombre: gift.nombre, esPredeterminado: true }
      });
      
      if (!existing) {
        await prisma.gift.create({ data: gift });
      }
    }
    console.log('✅ Regalos predeterminados creados/actualizados');
  } catch (error) {
    console.error('❌ Error al crear regalos:', error);
  }
};

module.exports = createDefaultGifts;
