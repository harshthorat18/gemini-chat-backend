// routes/chatRoutes.js
const express = require('express');
const {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  deleteMessage,
} = require('../controllers/chatController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// ✅ PUBLIC (no token needed)
router.post('/', sendMessage);

// 🔐 PROTECTED (token needed)
router.get('/history', protect, getChatHistory);
router.delete('/clear', protect, clearChatHistory);
router.delete('/message/:messageId', protect, deleteMessage);

module.exports = router;
