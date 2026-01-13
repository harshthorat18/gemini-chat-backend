// controllers/chatController.js
const Chat = require('../models/chatModel');
const getGeminiResponse = require('../utils/gemini');

// Send message (AI response only)
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    console.log('📩 Received message:', message);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiResponse = await getGeminiResponse(message);

    console.log('🤖 AI response:', aiResponse);

    res.json({
      id: Date.now(),
      content: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('🔥 Error in sendMessage:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const chat = await Chat.findOne({ user: req.user._id });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    console.error('🔥 Error in getChatHistory:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Clear chat history
const clearChatHistory = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      chat = new Chat({
        user: req.user._id,
        messages: [],
      });
    } else {
      chat.messages = [];
    }

    await chat.save();
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('🔥 Error in clearChatHistory:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a specific message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const index = chat.messages.findIndex(
      (msg) => msg._id.toString() === messageId
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }

    chat.messages.splice(index, 1);
    await chat.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('🔥 Error in deleteMessage:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  deleteMessage,
};
