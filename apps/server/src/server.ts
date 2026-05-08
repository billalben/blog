import express from "express";

import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import v1Routes from "./routes/v1";

import config from "@/config";
import limiter from "@/lib/express-rate-limit";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import logger from "./lib/winston";

// Create Express app
const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      config.WHITELISTED_ORIGINS.includes(origin || "")
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    }

    logger.warn(`CORS error: ${origin} is not allowed by CORS`);
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

// Use CORS middleware with the defined options

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(
  compression({
    threshold: 1024, // Compress responses larger than 1KB
  })
); // Enable response compression
app.use(helmet()); // Set security-related HTTP headers
app.use(limiter); // Apply rate limiting to all requests

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
(async () => {
  // Initialize database connection here if needed
  try {
    await connectToDatabase(); // Connect to the database before starting the server

    app.use("/api/v1", v1Routes);

    app.get("/", (req, res) => {
      res.json({ message: "Welcome to the Blog API!" });
    });

    app.listen(config.PORT, () => {
      logger.info(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);

    if (config.NODE_ENV === "production") {
      process.exit(1); // Exit with failure code in production
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase(); // Ensure database connection is closed
    logger.info("Server shutdown complete. Exiting process.");
    process.exit(0); // Exit with success code
  } catch (error) {
    logger.error("Error during server shutdown:", error);
  }
};

// Handle graceful shutdown on SIGINT and SIGTERM signals
process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
