import { Router } from "express";

import User from "@/models/user";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  getCurrentUser
);

router.put(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  updateCurrentUser
);

export default router;
