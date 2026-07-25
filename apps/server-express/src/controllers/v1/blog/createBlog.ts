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
  console.log(req.body);

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

    return successResponse(
      res,
      { blog: newBlog },
      "Blog post created successfully",
      201
    );
  } catch (error) {
    logger.error("Error creating blog post:", error);

    return errorResponse(res, "Internal server error", 500);
  }
};

export default createBlog;
