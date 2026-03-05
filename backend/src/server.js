import dotenv from "dotenv";
import { createServer } from "http";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initSockets } from "./sockets/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

    await connectDB();
    const httpServer = createServer(app);
    const io = initSockets(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

startServer();