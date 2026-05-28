import type { Request, Response } from "express";

import logger from "@/lib/winston";

import Blog from "@/models/blog";
import User from "@/models/user";
import Comment from "@/models/comment";

import { errorResponse, successResponse } from "@/lib/response";
import { Types } from "mongoose";

const deleteComment = async (req: Request, res: Response) => {
  try {
    const currentUser = req.userId;
    const { commentId } = req.params as { commentId: string };

    const comment = await Comment.findById(commentId)
      .select("blogId userId")
      .lean()
      .exec();

    if (!comment) {
      return errorResponse(res, "Comment not found", 404);
    }

    const user = await User.findById(comment?.userId)
      .select("role")
      .lean()
      .exec();

    const blog = await Blog.findById(comment?.blogId)
      .select("commentsCount")
      .exec();

    if (!user || !blog) {
      logger.error("User or blog not found", {
        userId: currentUser,
        commentId: commentId,
        userRole: user?.role,
        blogId: blog?._id,
      });

      return errorResponse(res, "User or blog not found", 404);
    }

    if (
      comment?.userId.toString() !== currentUser?.toString() &&
      user?.role !== "admin"
    ) {
      logger.error("User is not authorized to delete this comment", {
        userId: currentUser,
        commentId: commentId,
        userRole: user?.role,
      });

      return errorResponse(
        res,
        "You are not authorized to delete this comment",
        403
      );
    }

    await Comment.findByIdAndDelete(commentId);

    blog.commentsCount--;
    await blog.save();

    logger.info("Comment deleted successfully", {
      userId: currentUser,
      commentId: commentId,
      blogId: blog?._id,
      commentsCount: blog.commentsCount,
    });

    return successResponse(res, null, "Comment deleted successfully", 204);
  } catch (error) {
    logger.error("Error deleting comment:", error);

    return errorResponse(res, "Error deleting comment", 500);
  }
};

export default deleteComment;
