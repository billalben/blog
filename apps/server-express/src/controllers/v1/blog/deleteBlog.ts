import type { Request, Response } from "express";

import logger from "@/lib/winston";

import { v2 as cloudinary } from "cloudinary";

import Blog, { type IBlog } from "@/models/blog";
import User from "@/models/user";

type TBlogData = Pick<IBlog, "title" | "content" | "status" | "banner">;

import { errorResponse, successResponse } from "@/lib/response";

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select("role").lean().exec();
    const blog = await Blog.findById(blogId)
      .select("author banner.publicId")
      .exec();

    if (!blog) {
      logger.error("Blog not found", {
        userId: req.userId,
        ip: req.ip,
        blogId: blogId,
      });

      return errorResponse(res, "Blog not found", 404);
    }

    if (
      blog.author.toString() !== userId?.toString() &&
      user?.role !== "admin"
    ) {
      logger.error("User is not authorized to delete this blog", {
        userId: req.userId,
        ip: req.ip,
        blogId: blogId,
      });

      return errorResponse(
        res,
        "You are not authorized to delete this blog",
        403
      );
    }

    if (blog.banner?.publicId) {
      await cloudinary.uploader.destroy(blog.banner.publicId);
    }

    await Blog.findByIdAndDelete(blogId);

    logger.info("Blog deleted successfully", {
      userId: req.userId,
      ip: req.ip,
      blogId: blogId,
    });

    return successResponse(res, null, "Blog deleted successfully", 204);
  } catch (error) {
    logger.error("Error deleting blog:", error);

    return errorResponse(res, "Internal server error", 500);
  }
};

export default deleteBlog;
