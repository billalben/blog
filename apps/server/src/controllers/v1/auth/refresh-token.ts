import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import logger from "@/lib/winston";

import Token from "@/models/token";

import type { Request, Response } from "express";
import { Types } from "mongoose";
import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { successResponse, errorResponse } from "@/lib/response";

const refreshToken = async (req: Request, res: Response) => {
  const refreshTokenCookie: string = req.cookies.refreshToken;

  try {
    const tokenExists = await Token.exists({ token: refreshTokenCookie });

    if (!tokenExists) {
      logger.warn("Refresh token not found in database", {
        refreshToken: refreshTokenCookie,
      });
      return errorResponse(res, "Invalid or expired refresh token", 401);
    }

    const jwtPayload = verifyRefreshToken(refreshTokenCookie) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(jwtPayload.userId);

    logger.info("Access token refreshed successfully", {
      userId: jwtPayload.userId,
    });

    return successResponse(res, { accessToken }, "Access token refreshed");
  } catch (error) {
    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError
    ) {
      logger.warn("Invalid or expired refresh token", {
        refreshToken: refreshTokenCookie,
      });
      return errorResponse(res, "Invalid or expired refresh token", 401);
    }

    logger.error(
      "Error refreshing token:",
      error instanceof Error ? error.message : error
    );
    return errorResponse(res, "Invalid or expired refresh token", 401);
  }
};

export default refreshToken;
