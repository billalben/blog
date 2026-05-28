import { Router } from "express";

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";

import commentOnBlog from "@/controllers/v1/comment/commentOnBlog";
import getCommentsByBlog from "@/controllers/v1/comment/getCommentsByBlog";

import {
  CreateCommentBodySchema,
  CreateCommentParamsSchema,
  GetCommentsByBlogIdParamsSchema,
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

// get comments by blog id
router.get(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  validate({ params: GetCommentsByBlogIdParamsSchema }),
  getCommentsByBlog
);

export default router;
