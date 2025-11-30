const express = require('express');
const router = express.Router();
const giftController = require('../controllers/giftController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/default', giftController.getDefaultGifts);
router.get('/streamer/:streamerId', giftController.getStreamerCustomGifts);

// Rutas protegidas
router.post('/custom', authMiddleware, giftController.createCustomGift);
router.post('/send', authMiddleware, giftController.sendGift);
router.post('/buy-coins', authMiddleware, giftController.buyCoins);
router.get('/balance', authMiddleware, giftController.getBalance);
router.get('/transactions', authMiddleware, giftController.getTransactionHistory);

module.exports = router;
