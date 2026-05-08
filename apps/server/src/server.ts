import app from "./app";

import config from "@/config";
import logger from "./lib/winston";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";

(async () => {
  try {
    await connectToDatabase();
    app.listen(config.PORT, () => {
      logger.info(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info("Server shutdown complete. Exiting process.");
    process.exit(0);
  } catch (error) {
    logger.error("Error during server shutdown:", error);
  }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
