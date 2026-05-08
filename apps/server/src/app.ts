import express from "express";

import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import v1Routes from "./routes/v1";

import config from "@/config";
import limiter from "@/lib/express-rate-limit";
import logger from "./lib/winston";

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      config.WHITELISTED_ORIGINS.includes(origin || "")
    ) {
      callback(null, true);
    } else {
      logger.warn(`CORS error: ${origin} is not allowed by CORS`);
      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(compression({ threshold: 1024 }));
app.use(helmet());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", v1Routes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Blog API!" });
});

export default app;
