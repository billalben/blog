import createBlog from "@/controllers/v1/blog/createBlog";
import getAllBlogs from "@/controllers/v1/blog/getAllBlogs";
import getAllBlogsbyUser from "@/controllers/v1/blog/getBlogsByUser";
import getBlogBySlug from "@/controllers/v1/blog/getBlogBySlug";
import updateBlog from "@/controllers/v1/blog/updateBlog";

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";
import { validate } from "@/middlewares/validate";

import {
  CreateBlogBodySchema,
  GetAllBlogsQuerySchema,
  GetBlogBySlugParamsSchema,
  GetBlogsByUserIdParamsSchema,
  UpdateBlogBodySchema,
  UpdateBlogByIdParamsSchema,
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

router.get(
  "/:slug",
  authenticate,
  authorize(["admin", "user"]),
  validate({ params: GetBlogBySlugParamsSchema }),
  getBlogBySlug
);

// update blog
router.put(
  "/:blogId",
  authenticate,
  authorize(["admin"]),
  validate({ params: UpdateBlogByIdParamsSchema }),
  validate({ body: UpdateBlogBodySchema }),
  updateBlog
);

export default router;
