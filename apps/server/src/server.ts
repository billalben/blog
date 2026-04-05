import express from "express";

import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import config from "@/config";
import limiter from "@/lib/express-rate-limit";

// Create Express app
const app = express();

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (
      config.NODE_ENV === "development" ||
      config.WHITELISTED_ORIGINS.includes(origin || "")
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    }

    console.log(`CORS error: ${origin} is not allowed by CORS`);
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

// Use CORS middleware with the defined options
app.use(cors(corsOptions));

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(
  compression({
    threshold: 1024, // Compress responses larger than 1KB
  }),
); // Enable response compression
app.use(helmet()); // Set security-related HTTP headers
app.use(limiter); // Apply rate limiting to all requests

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

(async () => {
  // Initialize database connection here if needed
  try {
    app.get("/", (req, res) => {
      res.send("Hello from TypeScript + Express 🚀");
    });

    app.listen(config.PORT, () => {
      console.log(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);

    if (config.NODE_ENV === "production") {
      process.exit(1); // Exit with failure code in production
    }
  }
})();
