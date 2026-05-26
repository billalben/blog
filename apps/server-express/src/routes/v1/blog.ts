import createBlog from "@/controllers/v1/blog/createBlog";
import getAllBlogs from "@/controllers/v1/blog/getAllBlogs";
import getAllBlogsbyUser from "@/controllers/v1/blog/getBlogsByUser";
import getBlogBySlug from "@/controllers/v1/blog/getBlogBySlug";

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";
import { validate } from "@/middlewares/validate";

import {
  CreateBlogBodySchema,
  GetAllBlogsQuerySchema,
  GetBlogBySlugParamsSchema,
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

router.get(
  "/user/:userId",
  authenticate,
  authorize(["admin", "user"]),
  validate({ params: GetBlogsByUserIdParamsSchema }),
  getAllBlogsbyUser
);

// get blog by slug
router.get(
  "/:slug",
  authenticate,
  authorize(["admin", "user"]),
  validate({ params: GetBlogBySlugParamsSchema }),
  getBlogBySlug
);

export default router;
