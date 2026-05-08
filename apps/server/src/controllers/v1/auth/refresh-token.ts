import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import logger from "@/lib/winston";

import Token from "@/models/token";

import type { Request, Response } from "express";
import { Types } from "mongoose";
import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken: string = req.cookies.refreshToken;

  try {
    const tokenExists = await Token.exists({ token: refreshToken });

    if (!tokenExists) {
      res.status(401).json({
        status: "error",
        message: "Invalid or expired refresh token",
      });

      logger.warn("Refresh token not found in database", { refreshToken });

      return;
    }

    // verify the refresh token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(jwtPayload.userId);

    res.status(200).json({
      accessToken,
    });

    logger.info("Access token refreshed successfully", {
      userId: jwtPayload.userId,
    });
  } catch (error) {
    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError
    ) {
      res.status(401).json({
        status: "error",
        message: "Invalid or expired refresh token",
      });

      logger.warn("Invalid or expired refresh token", { refreshToken });
      return;
    }

    res.status(401).json({
      status: "error",
      message: "Invalid or expired refresh token",
    });

    logger.error(
      "Error refreshing token:",
      error instanceof Error ? error.message : error
    );
  }
};

export default refreshToken;
