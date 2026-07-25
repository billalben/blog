import type { Request, Response } from "express";

import logger from "@/lib/winston";

import User from "@/models/user";
import Blog from "@/models/blog";

import { errorResponse, successResponse } from "@/lib/response";

const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const slug = req.params.slug;

    const user = await User.findById(userId).select("role").lean().exec();

    const blog = await Blog.findOneAndUpdate(
      { slug: slug as string },
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .select("-banner.publicId -__v")
      .populate("author", "-createdAt -updatedAt -__v")
      .lean()
      .exec();

    if (!blog) {
      return errorResponse(res, "Blog not found", 404);
    }

    if (user?.role === "user" && blog.status === "draft") {
      logger.info("User is not authorized to access this draft blog", {
        userId: req.userId,
        ip: req.ip,
        slug: slug,
      });

      return errorResponse(
        res,
        "You are not authorized to access this draft blog",
        403
      );
    }

    logger.info("Retrieved blog by slug successfully", {
      userId: req.userId,
      ip: req.ip,
      slug: slug,
    });

    const rawBlog = blog as unknown as Record<string, unknown>;
    const author = rawBlog.author as
      | { _id: { toString(): string }; username: string; email: string; role: string }
      | undefined;
    const normalizedAuthor = author
      ? { id: author._id.toString(), username: author.username, email: author.email, role: author.role }
      : rawBlog.author;
    const normalized = { ...rawBlog, author: normalizedAuthor };

    return successResponse(res, { blog: normalized }, "Blog retrieved successfully");
  } catch (error) {
    logger.error("Failed to retrieve blog by slug", {
      userId: req.userId,
      ip: req.ip,
      error,
    });

    return errorResponse(res, "Failed to retrieve blog by slug");
  }
};

export default getBlogBySlug;
