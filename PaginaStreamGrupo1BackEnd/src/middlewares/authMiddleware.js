const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    console.log('🔐 [authMiddleware] Verificando autenticación para:', req.method, req.path);
    
    // Obtener token del header
    const authHeader = req.headers.authorization;
    console.log('🔑 [authMiddleware] Authorization header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ [authMiddleware] Token no encontrado o formato incorrecto');
      return res.status(401).json({ error: 'Debes iniciar sesión' });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    console.log('🎫 [authMiddleware] Token extraído:', token.substring(0, 20) + '...');

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporal');
    console.log('✅ [authMiddleware] Token válido para usuario:', decoded.userId, decoded.username);
    
    // Agregar userId al request
    req.userId = decoded.userId;
    req.username = decoded.username;
    
    next();
  } catch (error) {
    console.error('❌ [authMiddleware] Error:', error.name, error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Sesión inválida' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Tu sesión expiró, vuelve a ingresar' });
    }
    return res.status(500).json({ error: 'Error al verificar token' });
  }
};

module.exports = authMiddleware;
