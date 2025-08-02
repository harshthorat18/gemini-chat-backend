// routes/chatRoutes.js
const express = require('express');
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  deleteMessage,
} = require('../controllers/chatController');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.delete('/clear', protect, clearChatHistory);
router.delete('/message/:messageId', protect, deleteMessage);

module.exports = router;
