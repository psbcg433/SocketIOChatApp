import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();
const app = express();

connectDB();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Vite default port
app.use(morgan('combined'));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));