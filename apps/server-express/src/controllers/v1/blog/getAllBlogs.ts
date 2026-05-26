import type { Request, Response } from "express";

import logger from "@/lib/winston";
import Blog from "@/models/blog";
import User from "@/models/user";

import { paginate, paginatedResponse, errorResponse } from "@/lib/response";
import { GetAllUsersQuerySchema } from "@/schemas/user.schema";

type TQueryType = {
  status?: "draft" | "published";
};

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { page, page_size } = GetAllUsersQuerySchema.parse(req.query);

    const user = await User.findById(userId).select("role").lean().exec();
    const query: TQueryType = {};

    // show only the published blogs to the normal user
    if (user?.role === "user") {
      query.status = "published";
    }

    const [blogs, count] = await Promise.all([
      Blog.find(query)
        .select("-banner.publicId -__v")
        .populate("author", "-createdAt -updatedAt -__v")
        .skip((page - 1) * page_size)
        .sort({ createdAt: -1 })
        .limit(page_size)
        .lean()
        .exec(),
      User.countDocuments(),
    ]);

    const totalPages = Math.ceil(count / page_size);

    if (page > totalPages) {
      return errorResponse(res, "Page not found", 404);
    }

    const meta = paginate(count, page, page_size, req);

    logger.info("Retrieved all blogs successfully", {
      userId: req.userId,
      ip: req.ip,
      totalBlogs: count,
    });

    return paginatedResponse(res, blogs, meta, "Blogs retrieved successfully");
  } catch (error) {
    logger.error("Failed to retrieve blogs", {
      userId: req.userId,
      ip: req.ip,
      error,
    });

    return errorResponse(res, "Failed to retrieve blogs");
  }
};

export default getAllBlogs;
