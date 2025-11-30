const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Debes iniciar sesión' });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporal');
    
    // Agregar userId al request
    req.userId = decoded.userId;
    req.username = decoded.username;
    
    next();
  } catch (error) {
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
