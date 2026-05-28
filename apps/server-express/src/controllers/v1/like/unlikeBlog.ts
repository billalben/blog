import type { Request, Response } from "express";

import logger from "@/lib/winston";

import Blog, { type IBlog } from "@/models/blog";
import Like from "@/models/like";

import { errorResponse, successResponse } from "@/lib/response";
import { Types } from "mongoose";

const unlikeBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as unknown as { blogId: Types.ObjectId };
    const { userId }: { userId: string } = req.body;

    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
    if (!existingLike) {
      return errorResponse(res, "You have not liked this blog", 400);
    }

    await Like.findByIdAndDelete({ _id: existingLike._id }).lean().exec();

    const blog = await Blog.findById(blogId).select("likesCount");
    if (!blog) {
      return errorResponse(res, "Blog not found", 404);
    }

    blog.likesCount--;
    await blog.save();

    logger.info("Blog unliked successfully", {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    return successResponse(
      res,
      { likesCount: blog.likesCount },
      "Blog unliked successfully",
      200
    );
  } catch (error) {
    logger.error("Error unliking blog:", error);

    return errorResponse(res, "Error unliking blog", 500);
  }
};

export default unlikeBlog;
