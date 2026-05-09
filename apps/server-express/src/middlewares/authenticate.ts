import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyAccessToken } from "@/lib/jwt";
import logger from "@/lib/winston";

import type { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";
import { errorResponse } from "@/lib/response";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(
      "Unauthorized access attempt: Missing or invalid Authorization header",
      { ip: req.ip }
    );
    return errorResponse(res, "Unauthorized", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    req.userId = jwtPayload.userId;

    logger.info("Access token verified successfully", {
      userId: jwtPayload.userId,
      ip: req.ip,
    });

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      logger.warn("Access token expired", { ip: req.ip });
      return errorResponse(res, "Access token expired", 401);
    }

    if (error instanceof JsonWebTokenError) {
      logger.warn("Invalid access token", { ip: req.ip });
      return errorResponse(res, "Invalid access token", 401);
    }

    logger.error("Error verifying access token:", error);
    return errorResponse(res, "Internal server error");
  }
};

export default authenticate;
