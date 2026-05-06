import logger from "@/lib/windston";
import config from "@/config";
import type { Request, Response } from "express";

import User, { type IUser } from "@/models/user";
import Token from "@/models/token";

import { genUsername } from "@/utils";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

type TUserData = Pick<IUser, "email" | "password" | "role">;

const register = async (req: Request, res: Response) => {
  const { email, password, role }: TUserData = req.body;

  if (role === "admin" && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      status: "error",
      message: "Email is not authorized to register as admin",
    });

    logger.warn("Unauthorized admin registration attempt", { email });

    return;
  }

  try {
    const username = genUsername();
    const newUser = await User.create({ username, email, password, role });

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in the database
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

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info("User registered successfully", {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    logger.error("Error registering user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export default register;
