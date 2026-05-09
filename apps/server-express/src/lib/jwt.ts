import jwt from "jsonwebtoken";
import config from "@/config";

import { Types } from "mongoose";

export const generateAccessToken = (userId: Types.ObjectId) => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId: Types.ObjectId) => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token: string | undefined) => {
  if (!token) {
    throw new Error("Access token is missing");
  }
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string | undefined) => {
  if (!token) {
    throw new Error("Refresh token is missing");
  }
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};
