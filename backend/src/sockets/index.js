import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import redis from '../config/redis.js';
import { authenticateSocket } from './middlewares/socketAuth.js';
import { setupPresence } from './handlers/presenceHandler.js';

export const initSockets = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000, 
  });


  const pubClient = redis.duplicate();
  const subClient = redis.duplicate();
  io.adapter(createAdapter(pubClient, subClient));

  
  io.use(authenticateSocket);


  io.on('connection', (socket) => {
    console.log(`🔌 Connected: User ${socket.userId} (socket ${socket.id})`);
    setupPresence(io, socket); 

    socket.on('disconnect', () => {
      console.log(`🔌 Disconnected: User ${socket.userId}`);
    });
  });

  return io;
};