import redis from '../../config/redis.js';
import Message from '../../models/Message.js';
import Conversation from '../../models/Conversation.js';

const TYPING_TTL = 5; // seconds

export const setupChat = (io, socket) => {
  socket.on('message:send', async ({ conversationId, content }, ack) => {
    try {
      const message = new Message({
        conversation: conversationId,
        sender: socket.userId,
        content: content.trim(),
      });
      await message.save();

      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id, updatedAt: new Date() });

      const populated = await message.populate('sender', 'username avatar');

      // Broadcast to room (join on chat load)
      socket.to(conversationId).emit('message:received', { message: populated });
      ack({ success: true, message: populated });
    } catch (err) {
      ack({ success: false, error: err.message });
    }
  });

  socket.on('typing:start', ({ conversationId }) => {
    socket.join(conversationId); // Join room for targeted emits
    socket.to(conversationId).emit('typing:start', { userId: socket.userId });
    redis.expire(`typing:${conversationId}`, TYPING_TTL);
  });

  socket.on('typing:stop', ({ conversationId }) => {
    socket.to(conversationId).emit('typing:stop', { userId: socket.userId });
  });

  socket.on('message:read', async ({ messageIds }) => {
    await Message.updateMany(
      { _id: { $in: messageIds }, sender: { $ne: socket.userId } },
      { $addToSet: { readBy: { user: socket.userId, readAt: new Date() } } }
    );
    socket.to(messageIds[0].conversation).emit('message:read', { userId: socket.userId, messageIds });
  });
};