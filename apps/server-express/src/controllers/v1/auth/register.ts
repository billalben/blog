import logger from "@/lib/winston";
import config from "@/config";
import type { Request, Response } from "express";

import User, { type IUser } from "@/models/user";
import Token from "@/models/token";

import { genUsername } from "@/utils";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { successResponse, errorResponse } from "@/lib/response";

type TUserData = Pick<IUser, "email" | "password" | "role">;

const register = async (req: Request, res: Response) => {
  const { email, password, role }: TUserData = req.body;

  if (role === "admin" && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    logger.warn("Unauthorized admin registration attempt", { email });
    return errorResponse(
      res,
      "Email is not authorized to register as admin",
      403
    );
  }

  try {
    const username = genUsername();
    const newUser = await User.create({ username, email, password, role });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    await Token.create({ userId: newUser._id, token: refreshToken });
    logger.info("Refresh token stored in database", {
      userId: newUser._id,
      email: newUser.email,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    logger.info("User registered successfully", {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    return successResponse(
      res,
      {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    if (
      error instanceof Error &&
      (error as Error & { cause?: { code?: number } }).cause?.code === 11000
    ) {
      return errorResponse(
        res,
        "A user with this email already exists",
        409
      );
    }

    logger.error("Error registering user:", error);
    return errorResponse(res, "Internal server error");
  }
};

export default register;
