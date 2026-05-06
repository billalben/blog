import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyAccessToken } from "@/lib/jwt";
import logger from "@/lib/windston";

import type { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // if there is no Bearer token in the header, respond with 401 Unauthorized
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(
      "Unauthorized access attempt: Missing or invalid Authorization header",
      { ip: req.ip },
    );

    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });

    return;
  }

  // const token = authHeader.split(" ")[1];
  const [, token] = authHeader.split(" ");

  try {
    // Verify the access token and extract the user ID
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach the user ID to the request object for use in subsequent middleware or route handlers
    req.userId = jwtPayload.userId;

    logger.info("Access token verified successfully", {
      userId: jwtPayload.userId,
      ip: req.ip,
    });

    // Call the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      logger.warn("Access token expired", {
        ip: req.ip,
      });

      res.status(401).json({
        status: "error",
        message: "Access token expired",
      });

      return;
    }

    if (error instanceof JsonWebTokenError) {
      logger.warn("Invalid access token", {
        ip: req.ip,
      });

      res.status(401).json({
        status: "error",
        message: "Invalid access token",
      });

      return;
    }

    logger.error("Error verifying access token:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export default authenticate;
