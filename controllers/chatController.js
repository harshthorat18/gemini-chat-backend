// controllers/chatController.js
const Chat = require('../models/chatModel');
const getGeminiResponse = require('../utils/gemini');

const sendMessage = async (req, res) => {
  try {
    console.log('Received message:', req.body.message);

    if (!req.body.message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiResponse = await getGeminiResponse(req.body.message);
    console.log('AI response:', aiResponse);

    res.json({
      id: Date.now(),
      content: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

module.exports = { sendMessage };


// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id });

    if (chat) {
      res.json(chat.messages);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Clear chat history
const clearChatHistory = async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      // If chat doesn't exist, create a new empty one
      chat = new Chat({
        user: req.user._id,
        messages: [],
      });
    } else {
      // If chat exists, clear its messages
      chat.messages = [];
    }

    await chat.save();
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error in clearChatHistory:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Delete a specific message
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    console.log('👉 messageId from params:', messageId);
    console.log('👉 user ID from auth:', req.user._id);

    const chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      console.log('❌ Chat not found');
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messageIndex = chat.messages.findIndex(
      (msg) => msg._id.toString() === messageId
    );

    console.log('🔍 Available message IDs:', chat.messages.map(m => m._id.toString()));
    console.log('🔍 Found message index:', messageIndex);

    if (messageIndex === -1) {
      console.log('❌ Message not found');
      return res.status(404).json({ message: 'Message not found' });
    }

    chat.messages.splice(messageIndex, 1);
    await chat.save();

    console.log('✅ Message deleted');
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
