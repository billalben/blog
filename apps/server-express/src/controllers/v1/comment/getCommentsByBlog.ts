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
      .populate("userId", "username email role")
      .lean()
      .exec();

    if (!allComments) {
      return errorResponse(res, "No comments found", 404);
    }

    const comments = allComments.map((comment) => {
      const rawComment = comment as unknown as Record<string, unknown>;
      const rawUser = rawComment.userId as
        | { _id: { toString(): string }; username: string; email: string; role: string }
        | undefined;
      const author = rawUser
        ? { id: rawUser._id.toString(), username: rawUser.username, email: rawUser.email, role: rawUser.role }
        : undefined;
      const { userId, ...rest } = rawComment;
      return { ...rest, author };
    });

    return successResponse(
      res,
      { comments },
      "Comments retrieved successfully"
    );
  } catch (error) {
    logger.error("Error getting comments by blog id:", error);

    return errorResponse(res, "Error getting comments by blog id", 500);
  }
};

export default getCommentsByBlog;
