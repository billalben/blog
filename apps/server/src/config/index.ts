import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  WHITELISTED_ORIGINS: process.env.WHITELISTED_ORIGINS?.split(",") || [],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access_secret",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  ACCESS_TOKEN_EXPIRY: "1h" as const,
  REFRESH_TOKEN_EXPIRY: "7d" as const,
  WHITELIST_ADMINS_MAIL: ["billal@domain.com", "admin@domain.com"],
};

export default config;
