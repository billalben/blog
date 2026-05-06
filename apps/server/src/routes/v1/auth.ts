import { Router } from "express";

import { body, cookie } from "express-validator";
import bcrypt from "bcrypt";
import validationErrorMiddleware from "@/middlewares/validationError";
import User from "@/models/user";

// controllers
import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import refreshToken from "@/controllers/v1/auth/refresh-token";
import logout from "@/controllers/v1/auth/logout";
import authenticate from "@/middlewares/authenticate";

const router = Router();

router.post(
  "/register",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isLength({ max: 50 })
      .withMessage("Email cannot exceed 50 characters")
      .isEmail()
      .withMessage("Invalid email format")
      .custom(async (value) => {
        const existingUser = await User.exists({ email: value });
        if (existingUser) {
          throw new Error("User already exists");
        }
        return true;
      }),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .optional()
      .isString()
      .withMessage("Role must be a string")
      .isIn(["user", "admin"])
      .withMessage("Invalid role"),
  ],
  validationErrorMiddleware,
  register,
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isLength({ max: 50 })
      .withMessage("Email cannot exceed 50 characters")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .custom(async (value, { req }) => {
        const { email }: { email: string } = req.body;
        const user = await User.findOne({ email })
          .select("password")
          .lean()
          .exec();

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(value, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        return true;
      }),
    body("role")
      .optional()
      .isString()
      .withMessage("Role must be a string")
      .isIn(["user", "admin"])
      .withMessage("Invalid role"),
  ],
  validationErrorMiddleware,
  login,
);

router.post(
  "/refresh-token",
  cookie("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required")
    .isJWT()
    .withMessage("Invalid refresh token format"),
  validationErrorMiddleware,
  refreshToken,
);

router.post("/logout", authenticate, logout);

export default router;
