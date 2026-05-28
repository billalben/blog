import type { Request, Response } from "express";

import logger from "@/lib/winston";

import Blog, { type IBlog } from "@/models/blog";
import Like from "@/models/like";

import { errorResponse, successResponse } from "@/lib/response";
import { Types } from "mongoose";

const likeBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as unknown as { blogId: Types.ObjectId };
    const { userId }: { userId: string } = req.body;

    const blog = await Blog.findById(blogId).select("likesCount").exec();

    if (!blog) {
      return errorResponse(res, "Blog not found", 404);
    }

    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
    if (existingLike) {
      return errorResponse(res, "You have already liked this blog", 400);
    }

    await Like.create({ blogId, userId });
    blog.likesCount++;
    await blog.save();

    logger.info("Blog liked successfully", {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    return successResponse(
      res,
      { likesCount: blog.likesCount },
      "Blog liked successfully",
      200
    );
  } catch (error) {
    logger.error("Error liking blog:", error);

    return errorResponse(res, "Error liking blog", 500);
  }
};

export default likeBlog;
