import { Router } from "express";

import User from "@/models/user";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import getCuerrentUser from "@/controllers/v1/auth/get_current_user";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  getCuerrentUser
);

export default router;
