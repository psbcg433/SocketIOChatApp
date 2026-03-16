

import 'dotenv/config';
import http from 'http';
import { validateEnv, env } from './config/env.js';
import connectDB from './config/db.js';
import createApp from './app.js';
import { initializeSocket } from './socket/index.js';
import { handleUnhandledRejection } from './middleware/errorHandler.js';

// ─── Register global error handlers FIRST ────────────────────────────
handleUnhandledRejection();

const startServer = async () => {
  // ─── Step 1: Validate environment ─────────────────────────────────
  validateEnv();

  // ─── Step 2: Connect to database ──────────────────────────────────
  await connectDB();

  // ─── Step 3: Create Express app ───────────────────────────────────
  const app = createApp();

  // ─── Step 4: Create HTTP server ───────────────────────────────────
  // We create the HTTP server manually (not app.listen) because
  // Socket.io needs to attach to the HTTP server, not Express
  const httpServer = http.createServer(app);

  // ─── Step 5: Initialize Socket.io ────────────────────────────────
  initializeSocket(httpServer);

  // ─── Step 6: Start listening ──────────────────────────────────────
  httpServer.listen(env.port, () => {
    console.log('');
    console.log('┌─────────────────────────────────────────┐');
    console.log(`│  🚀 Server running                      │`);
    console.log(`│  Port:  ${env.port}                            │`);
    console.log(`│  Mode:  ${env.nodeEnv}                   │`);
    console.log(`│  URL:   http://localhost:${env.port}          │`);
    console.log('└─────────────────────────────────────────┘');
    console.log('');
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down gracefully...`);

    httpServer.close(async () => {
      console.log('HTTP server closed');

      const mongoose = await import('mongoose');
      await mongoose.default.connection.close();
      console.log('MongoDB connection closed');

      console.log('✅ Graceful shutdown complete');
      process.exit(0);
    });

    // Force shutdown after 30s
    setTimeout(() => {
      console.error('❌ Forced shutdown after timeout');
      process.exit(1);
    }, 30_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();