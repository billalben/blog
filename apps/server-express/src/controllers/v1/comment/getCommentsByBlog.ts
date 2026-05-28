import type { Request, Response } from "express";

import logger from "@/lib/winston";

import Blog from "@/models/blog";
import Comment from "@/models/comment";

import { errorResponse, successResponse } from "@/lib/response";
import { Types } from "mongoose";

const getCommentsByBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as { blogId: string };

    if (!req.userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (!Types.ObjectId.isValid(blogId)) {
      return errorResponse(res, "Invalid blog id", 400);
    }

    const blogObjectId = new Types.ObjectId(blogId);

    const blog = await Blog.findById(blogObjectId).select("_id").lean().exec();

    if (!blog) {
      return errorResponse(res, "Blog not found", 404);
    }

    const allComments = await Comment.find({ blogId: blogObjectId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!allComments) {
      return errorResponse(res, "No comments found", 404);
    }

    return successResponse(
      res,
      { comments: allComments },
      "Comments retrieved successfully"
    );
  } catch (error) {
    logger.error("Error getting comments by blog id:", error);

    return errorResponse(res, "Error getting comments by blog id", 500);
  }
};

export default getCommentsByBlog;
