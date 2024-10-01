import { logger } from "@soundspheree/common";
import { app } from "./app";
import { initiateConsumer } from "./utils/broker";
import { connectDB } from "./utils/connect-db";

// start the servers
app.listen(3000, async () => {
  logger.info("Product Server is running on port 3000");
  connectDB()
    .then(async () => {
      logger.info("Connected to MongoDB");

      // consumer from kafka remove this later
      await initiateConsumer();
    })
    .catch((err) => {
      logger.error(err);
    });
});
