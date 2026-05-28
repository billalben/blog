import { Router } from "express";

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";

import {
  LikeBlogBodySchema,
  LikeBlogParamsSchema,
} from "@/schemas/like.schema";

import likeBlog from "@/controllers/v1/like/likeBlog";
import unlikeBlog from "@/controllers/v1/like/unlikeBlog";

const router = Router();

router.post(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  validate({ body: LikeBlogBodySchema, params: LikeBlogParamsSchema }),
  likeBlog
);

router.delete(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  validate({ body: LikeBlogBodySchema, params: LikeBlogParamsSchema }),
  unlikeBlog
);

export default router;
