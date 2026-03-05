import Redis from "ioredis";
import logger from "../utils/logger.js";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 3000);
    logger.warn(`Redis reconnect attempt ${times}, retrying in ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: false,
  enableOfflineQueue: true, 
  enableDebug: process.env.NODE_ENV === 'development', 
});

// ======================
// REDIS EVENTS
// ======================
redis.on("connect", () => logger.info("Redis connected"));
redis.on("ready", () => logger.info("Redis ready"));
redis.on("error", (err) => logger.error("Redis error", { error: err.message }));
redis.on("close", () => logger.warn("Redis connection closed"));
redis.on("reconnecting", () => logger.warn("Redis reconnecting..."));
redis.on("end", () => logger.warn("Redis connection ended")); 

export default redis;