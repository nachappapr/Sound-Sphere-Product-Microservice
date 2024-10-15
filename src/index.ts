import { logger } from "@soundspheree/common";
import { app } from "./app";
import { initiateConsumer } from "./utils/broker";
import { connectDB } from "./utils/connect-db";
import redisClient from "./utils/redis-client";

async function initializeApp() {
  try {
    // Initialize MongoDB
    await connectDB();
    logger.info("Connected to MongoDB");

    // Initialize Redis
    logger.info("Initializing Redis client...");
    redisClient.on("connect", () => {
      logger.info("Connected to Redis");
    });

    redisClient.on("ready", () => {
      logger.info("Redis client is ready");
    });

    redisClient.on("error", (err) => {
      logger.error("Redis connection error:", err);
    });

    redisClient.on("reconnecting", () => {
      logger.info("Reconnecting to Redis...");
    });

    redisClient.on("end", () => {
      logger.info("Redis connection closed");
    });

    // Test Redis connection
    try {
      await redisClient.set("test-key", "test-value", "EX", 10);
      const value = await redisClient.get("test-key");
      logger.info(`Test key value: ${value}`);
    } catch (err) {
      logger.error("Error testing Redis connection:", err);
      throw err; // Rethrow the error to stop further initialization
    }

    // Initialize Consumer
    await initiateConsumer();
    logger.info("Consumer initiated successfully");

    // Start the application
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (err) {
    logger.error("Failed to initialize application", err);
    process.exit(1); // Exit the process with a failure code
  }
}

initializeApp();
