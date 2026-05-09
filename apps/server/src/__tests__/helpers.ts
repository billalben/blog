import mongoose from "mongoose";
import User from "@/models/user";
import Token from "@/models/token";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export const createUserInDb = async (overrides: Partial<{
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
}> = {}) => {
  const user = await User.create({
    username: overrides.username ?? "testuser",
    email: overrides.email ?? "test@example.com",
    password: overrides.password ?? "Test1234!",
    role: overrides.role ?? "user",
  });

  return user;
};

const createTokensForUser = async (userId: mongoose.Types.ObjectId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  await Token.create({ userId, token: refreshToken });

  return { accessToken, refreshToken };
};

export const createUserWithTokens = async (overrides?: Parameters<typeof createUserInDb>[0]) => {
  const user = await createUserInDb(overrides);
  const tokens = await createTokensForUser(user._id);
  return { user, ...tokens };
};

export const getRefreshTokenCookie = (refreshToken: string) => {
  return `refreshToken=${refreshToken}`;
};

export const VALID_PASSWORD = "Test1234!";
