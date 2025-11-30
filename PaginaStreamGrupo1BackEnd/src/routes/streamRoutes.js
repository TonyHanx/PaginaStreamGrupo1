const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/streamers', streamController.getAllStreamers);
router.get('/streamers/:id', streamController.getStreamerById);
router.get('/streams', streamController.getActiveStreams);
router.get('/streams/category/:category', streamController.getStreamsByCategory);

// Rutas protegidas (streamers)
router.post('/streams', authMiddleware, streamController.createOrUpdateStream);
router.put('/streams/end', authMiddleware, streamController.endStream);

module.exports = router;
