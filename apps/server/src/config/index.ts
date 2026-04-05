import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  WHITELISTED_ORIGINS: process.env.WHITELISTED_ORIGINS?.split(",") || [],
  MONGO_URI: process.env.MONGO_URI,
};

export default config;
