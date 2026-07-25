import type { Request, Response } from "express";

import logger from "@/lib/winston";

import Blog, { type IBlog } from "@/models/blog";

type TBlogData = Pick<IBlog, "title" | "content" | "status" | "banner">;

import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { errorResponse, successResponse } from "@/lib/response";

const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, status, banner }: TBlogData = req.body;
    const userId = req.userId;

    const cleanContent = domPurify.sanitize(content);

    const newBlog = new Blog({
      title,
      content: cleanContent,
      status,
      banner,
      author: userId,
    });

    await newBlog.save();
    await newBlog.populate("author", "-createdAt -updatedAt -__v");

    const blog = newBlog.toJSON() as unknown as Record<string, unknown>;
    const author = blog.author as
      | { _id: { toString(): string }; username: string; email: string; role: string }
      | undefined;
    const normalizedAuthor = author
      ? { id: author._id.toString(), username: author.username, email: author.email, role: author.role }
      : undefined;

    return successResponse(
      res,
      { blog: { ...blog, author: normalizedAuthor } },
      "Blog post created successfully",
      201
    );
  } catch (error) {
    logger.error("Error creating blog post:", error);

    return errorResponse(res, "Internal server error", 500);
  }
};

export default createBlog;
