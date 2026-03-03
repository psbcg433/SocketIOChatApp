import mongoose from 'mongoose';
import logger from '../utils/logger.js'; // we'll create logger next if needed, but keeping simple

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`DB Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;