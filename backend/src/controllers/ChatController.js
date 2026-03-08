import createError from 'http-errors';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

class ChatController {
  static async getMessages(req, res, next) {
    try {
      const { conversationId } = req.params;
      const { limit = 50, before } = req.query;
      const query = { conversation: conversationId };
      if (before) query.createdAt = { $lt: new Date(before) };

      const messages = await Message.find(query)
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean();

      res.json({ success: true, messages: messages.reverse() });
    } catch (err) {
      next(createError(500, err.message));
    }
  }

  static async sendMessage(req, res, next) {
    try {
      const { conversationId, content } = req.body;
      const message = new Message({
        conversation: conversationId,
        sender: req.user.id,
        content: content.trim(),
      });
      await message.save();

      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id, updatedAt: new Date() });

      const populated = await message.populate('sender', 'username avatar');
      res.status(201).json({ success: true, message: populated });
    } catch (err) {
      next(createError(500, err.message));
    }
  }
}

export default ChatController;