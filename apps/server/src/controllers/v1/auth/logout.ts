import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import logger from "@/lib/winston";
import config from "@/config";

import User from "@/models/user";
import Token from "@/models/token";

import type { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });

      logger.info("User logged out successfully", {
        userId: req.userId,
        ip: req.ip,
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.sendStatus(204);

    logger.info("user logged out successfully", {
      userId: req.userId,
    });
  } catch (error) {
    logger.error("Error logging out user:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export default logout;
