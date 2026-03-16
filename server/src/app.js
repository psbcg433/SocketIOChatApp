

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// ─── Route Imports ────────────────────────────────────────────────────
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import conversationRoutes from './routes/conversations.js';
import messageRoutes from './routes/messages.js';

const createApp = () => {
  const app = express();

  // ─── Security Headers ───────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ───────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ─── Request Parsing ────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.cookie.secret));

  // ─── Logging ────────────────────────────────────────────────────
  app.use(morgan(env.isDev ? 'dev' : 'combined'));

  // ─── Health Check ────────────────────────────────────────────────
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
    });
  });

  // ─── API Routes ──────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use('/api/messages', messageRoutes);

  // ─── 404 Handler ────────────────────────────────────────────────
  app.use('*', (req, res) => {
    res.status(404).json({
      status: 'fail',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  // ─── Global Error Handler  ────────────────────────
  app.use(errorHandler);

  return app;
};

export default createApp;