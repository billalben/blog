import { Router } from "express";

// controllers
import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import refreshToken from "@/controllers/v1/auth/refresh-token";
import logout from "@/controllers/v1/auth/logout";
import authenticate from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import {
  RegisterBodySchema,
  LoginBodySchema,
  RefreshTokenCookiesSchema,
} from "@/schemas/auth.schema";

const router = Router();

router.post("/register", validate({ body: RegisterBodySchema }), register);

router.post("/login", validate({ body: LoginBodySchema }), login);

router.post(
  "/refresh-token",
  validate({ cookies: RefreshTokenCookiesSchema }),
  refreshToken
);

router.post("/logout", authenticate, logout);

export default router;
