import type { Request, Response } from "express";

import logger from "@/lib/winston";

import User from "@/models/user";
import Blog from "@/models/blog";

import { errorResponse, successResponse } from "@/lib/response";

import { v2 as cloudinary } from "cloudinary";
import { Types } from "mongoose";

const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const blogs = await Blog.find({
      author: new Types.ObjectId(userId?.toString() ?? ""),
    })
      .select("banner.publicId")
      .lean()
      .exec();

    const publicIds = blogs
      .map((blog) => blog.banner?.publicId)
      .filter((id): id is string => !!id);

    if (publicIds.length > 0) {
      logger.info("Deleting blog banners", {
        userId: req.userId,
        ip: req.ip,
        publicIds: publicIds,
      });

      await cloudinary.api.delete_resources(publicIds);
    }

    await Blog.deleteMany({
      author: new Types.ObjectId(userId?.toString() ?? ""),
    });
    logger.info("Deleted blogs", {
      userId: req.userId,
      ip: req.ip,
      numberOfBlogs: blogs.length,
    });

    await User.findByIdAndDelete(userId);
    logger.info("Deleted user", {
      userId: req.userId,
      ip: req.ip,
    });

    return successResponse(res, null, "User deleted successfully", 204);
  } catch (error) {
    logger.error("Error deleting user:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

export default deleteCurrentUser;
