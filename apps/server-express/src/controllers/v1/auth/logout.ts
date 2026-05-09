import logger from "@/lib/winston";
import config from "@/config";

import Token from "@/models/token";

import type { Request, Response } from "express";
import { errorResponse } from "@/lib/response";

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

    logger.info("user logged out successfully", {
      userId: req.userId,
    });

    res.sendStatus(204);
  } catch (error) {
    logger.error("Error logging out user:", error);
    return errorResponse(res, "Internal server error");
  }
};

export default logout;
