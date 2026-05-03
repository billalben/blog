import { Router } from "express";

import { body } from "express-validator";
import validationErrorMiddleware from "@/middlewares/validationError";
import User from "@/models/user";

// controllers
import { register } from "@/controllers/v1/auth/register";

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

export default router;
