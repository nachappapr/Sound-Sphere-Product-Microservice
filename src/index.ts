import { logger } from "@soundspheree/common";
import { app } from "./app";
import { connectDB } from "./utils/connect-db";

// start the servers
app.listen(3000, async () => {
  logger.info("Product Server is running on port 3000");
  connectDB()
    .then(() => {
      logger.info("Connected to MongoDB");
    })
    .catch((err) => {
      logger.error(err);
    });
});
