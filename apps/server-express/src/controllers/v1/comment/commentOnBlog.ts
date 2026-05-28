import type { Request, Response } from "express";

import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import logger from "@/lib/winston";

import Blog, { type IBlog } from "@/models/blog";
import Comment, { type IComment } from "@/models/comment";

import { errorResponse, successResponse } from "@/lib/response";
import { Types } from "mongoose";

type TCommentData = Pick<IComment, "content">;

const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

const commentOnBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as { blogId: string };

    if (!req.userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (!Types.ObjectId.isValid(blogId)) {
      return errorResponse(res, "Invalid blog id", 400);
    }

    const userId = req.userId;
    const blogObjectId = new Types.ObjectId(blogId);
    const { content }: TCommentData = req.body;

    const blog = await Blog.findById(blogObjectId)
      .select("_id commentsCount")
      .exec();

    if (!blog) {
      return errorResponse(res, "Blog not found", 404);
    }

    const cleanContent = domPurify.sanitize(content);
    const newComment = await Comment.create({
      blogId: blogObjectId,
      userId,
      content: cleanContent,
    });

    logger.info("New comment created on blog", {
      blogId: blog._id,
      commentId: newComment,
    });

    blog.commentsCount++;
    await blog.save();

    logger.info("Comment created successfully", {
      userId,
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    return successResponse(
      res,
      { commentsCount: blog.commentsCount },
      "Comment created successfully",
      200
    );
  } catch (error) {
    logger.error("Error creating comment:", error);

    return errorResponse(res, "Error creating comment", 500);
  }
};

export default commentOnBlog;
