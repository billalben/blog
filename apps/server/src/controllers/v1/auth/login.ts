import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import logger from "@/lib/windston";
import config from "@/config";

import User from "@/models/user";
import Token from "@/models/token";

import type { Request, Response } from "express";
import type { IUser } from "@/models/user";

type TUserData = Pick<IUser, "email" | "password">;

const login = async (req: Request, res: Response) => {
  try {
    const { email }: TUserData = req.body;

    const user = await User.findOne({ email })
      .select("username email password role")
      .lean()
      .exec();

    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });

      logger.warn("Login attempt with non-existent email", { email });

      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in the database
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

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    logger.info("User logged in successfully", {
      userId: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    logger.error("Error logging in user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export default login;
