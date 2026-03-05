import redis from '../../config/redis.js';

const PRESENCE_KEY = (userId) => `presence:${userId}`;
const ONLINE_SET = 'onlineUsers';

export const setupPresence = (io, socket) => {
  const { userId } = socket;

  
  socket.join(`user:${userId}`);

 
  const markOnline = async () => {
    const multi = redis.multi();
    multi.hincrby(PRESENCE_KEY(userId), 'tabCount', 1);
    multi.hset(PRESENCE_KEY(userId), {
      socketId: socket.id,
      status: 'online',
      lastSeen: Date.now(),
    });
    multi.sadd(ONLINE_SET, userId);
    await multi.exec();

  
    io.emit('presence:join', { userId });
  };

  markOnline();

  socket.on('disconnect', async () => {
    const tabCount = await redis.hincrby(PRESENCE_KEY(userId), 'tabCount', -1);
    if (tabCount <= 0) {
      await redis.multi()
        .del(PRESENCE_KEY(userId))
        .srem(ONLINE_SET, userId)
        .exec();
      io.emit('presence:leave', { userId });
    }
  });
};