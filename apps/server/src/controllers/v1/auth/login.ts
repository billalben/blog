import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import logger from "@/lib/winston";
import config from "@/config";
import bcrypt from "bcrypt";

import User from "@/models/user";
import Token from "@/models/token";

import type { Request, Response } from "express";
import type { IUser } from "@/models/user";
import { successResponse, errorResponse } from "@/lib/response";

type TUserData = Pick<IUser, "email" | "password">;

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: TUserData = req.body;

    const user = await User.findOne({ email })
      .select("username email password role")
      .lean()
      .exec();

    if (!user) {
      logger.warn("Login attempt with non-existent email", { email });
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn("Login attempt with incorrect password", { email });
      return errorResponse(res, "Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.create({ userId: user._id, token: refreshToken });
    logger.info("Refresh token stored in database", {
      userId: user._id,
      email: user.email,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    logger.info("User logged in successfully", {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      "User logged in successfully",
      201
    );
  } catch (error) {
    logger.error("Error logging in user:", error);
    return errorResponse(res, "Internal server error");
  }
};

export default login;
