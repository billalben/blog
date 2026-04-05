import { rateLimit } from "express-rate-limit";
import { error } from "node:console";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Too many requests, please try again later.",
  },
});

export default limiter;
