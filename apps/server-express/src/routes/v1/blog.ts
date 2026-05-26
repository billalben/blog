import createBlog from "@/controllers/v1/blog/createBlog";
import getAllBlogs from "@/controllers/v1/blog/getAllBlogs";
import getAllBlogsbyUser from "@/controllers/v1/blog/getBlogsByUser";

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";
import { validate } from "@/middlewares/validate";

import {
  CreateBlogBodySchema,
  GetAllBlogsQuerySchema,
  GetBlogsByUserIdParamsSchema,
} from "@/schemas/blog.schema";
import { Router } from "express";

import multer from "multer";

const router = Router();

const upload = multer();

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  upload.single("banner_image"),
  validate({ body: CreateBlogBodySchema }),
  uploadBlogBanner("create"),
  createBlog
);

router.get(
  "/",
  authenticate,
  authorize(["admin", "user"]),
  validate({ query: GetAllBlogsQuerySchema }),
  getAllBlogs
);

// get blogs by user id
router.get(
  "/user/:userId",
  authenticate,
  authorize(["admin", "user"]),
  validate({ params: GetBlogsByUserIdParamsSchema }),
  getAllBlogsbyUser
);

export default router;
