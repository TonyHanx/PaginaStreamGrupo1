const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/prisma');

// Configuración
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido al API de Streaming',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      auth: '/api/auth',
      streams: '/api/streams',
      gifts: '/api/gifts',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const streamRoutes = require('./routes/streamRoutes');
const giftRoutes = require('./routes/giftRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api', streamRoutes);
app.use('/api/gifts', giftRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Sincronizar base de datos e iniciar servidor
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida con Prisma');
    
    // Crear regalos predeterminados
    const createDefaultGifts = require('./utils/seedGifts');
    await createDefaultGifts();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`📡 API disponible en:`);
      console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
      console.log(`   - Streams: http://localhost:${PORT}/api/streams`);
      console.log(`   - Gifts: http://localhost:${PORT}/api/gifts`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre gracioso
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
