import { Router } from "express";

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";

import commentOnBlog from "@/controllers/v1/comment/commentOnBlog";
import getCommentsByBlog from "@/controllers/v1/comment/getCommentsByBlog";
import deleteComment from "@/controllers/v1/comment/deleteComment";

import {
  CreateCommentBodySchema,
  CreateCommentParamsSchema,
  GetCommentsByBlogIdParamsSchema,
  DeleteCommentParamsSchema,
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

router.get(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  validate({ params: GetCommentsByBlogIdParamsSchema }),
  getCommentsByBlog
);

router.delete(
  "/:commentId",
  authenticate,
  authorize(["admin", "user"]),
  validate({ params: DeleteCommentParamsSchema }),
  deleteComment
);

export default router;
