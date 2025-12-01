const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/points', authMiddleware, authController.updatePoints);
router.put('/xp', authMiddleware, authController.updateXP);
router.post('/become-streamer', authMiddleware, authController.becomeStreamer);

module.exports = router;
