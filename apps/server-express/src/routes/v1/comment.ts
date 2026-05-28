import { Router } from "express";

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";

import commentOnBlog from "@/controllers/v1/comment/commentOnBlog";

import {
  CreateCommentBodySchema,
  CreateCommentParamsSchema,
} from "@/schemas/comment.schema";

const router = Router();

router.post(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  validate({
    body: CreateCommentBodySchema,
    params: CreateCommentParamsSchema,
  }),
  commentOnBlog
);

export default router;
