import type { Request, Response } from "express";

import logger from "@/lib/winston";

import Blog, { type IBlog } from "@/models/blog";
import User from "@/models/user";

type TBlogData = Partial<
  Pick<IBlog, "title" | "content" | "status" | "banner">
>;

import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { errorResponse, successResponse } from "@/lib/response";

const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

const updateBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, status, banner }: TBlogData = req.body;

    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select("role").lean().exec();
    const blog = await Blog.findById(blogId)
      .select("-__v")
      .populate("author", "-createdAt -updatedAt -__v")
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
      logger.error("User is not authorized to update this blog", {
        userId: req.userId,
        ip: req.ip,
        blogId: blogId,
      });
      return errorResponse(
        res,
        "You are not authorized to update this blog",
        403
      );
    }

    if (title) blog.title = title;
    if (content) {
      const cleanContent = domPurify.sanitize(content);
      blog.content = cleanContent;
    }
    if (status) blog.status = status;
    if (banner) blog.banner = banner;

    await blog.save();

    const blogJson = blog.toJSON() as unknown as Record<string, unknown>;
    const author = blogJson.author as
      | { _id: { toString(): string }; username: string; email: string; role: string }
      | undefined;
    const normalizedAuthor = author
      ? { id: author._id.toString(), username: author.username, email: author.email, role: author.role }
      : blogJson.author;
    const normalized = { ...blogJson, author: normalizedAuthor };

    logger.info("Blog updated successfully", {
      userId: req.userId,
      ip: req.ip,
      blogId: blogId,
      title: blog.title,
      content: blog.content,
      status: blog.status,
      banner: blog.banner,
    });

    return successResponse(res, { blog: normalized }, "Blog updated successfully", 200);
  } catch (error) {
    logger.error("Error updating blog post:", error);

    return errorResponse(res, "Internal server error", 500);
  }
};

export default updateBlog;
