import type { Request, Response } from "express";

import logger from "@/lib/winston";
import Blog from "@/models/blog";
import User from "@/models/user";

import { paginate, paginatedResponse, errorResponse } from "@/lib/response";
import { GetAllUsersQuerySchema } from "@/schemas/user.schema";
import { Types } from "mongoose";

type TQueryType = {
  status?: "draft" | "published";
};

const getAllBlogsbyUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.userId;
    const { page, page_size } = GetAllUsersQuerySchema.parse(req.query);

    const currentUser = await User.findById(currentUserId)
      .select("role")
      .lean()
      .exec();
    const query: TQueryType = {};

    // show only the published blogs to the normal user
    if (currentUser?.role === "user") {
      query.status = "published";
    }

    const [blogs, count] = await Promise.all([
      Blog.find({ author: new Types.ObjectId(userId as string), ...query })
        .select("-banner.publicId -__v")
        .populate("author", "-createdAt -updatedAt -__v")
        .skip((page - 1) * page_size)
        .sort({ createdAt: -1 })
        .limit(page_size)
        .lean()
        .exec(),
      Blog.countDocuments({
        author: new Types.ObjectId(userId as string),
        ...query,
      }),
    ]);

    const totalPages = Math.ceil(count / page_size);

    if (page > totalPages) {
      return errorResponse(res, "Page not found", 404);
    }

    const meta = paginate(count, page, page_size, req);

    logger.info("Retrieved all blogs by user successfully", {
      userId: req.userId,
      ip: req.ip,
      totalBlogs: count,
    });

    return paginatedResponse(
      res,
      blogs,
      meta,
      "Blogs by user retrieved successfully"
    );
  } catch (error) {
    logger.error("Failed to retrieve blogs by user", {
      userId: req.userId,
      ip: req.ip,
      error,
    });

    return errorResponse(res, "Failed to retrieve blogs by user");
  }
};

export default getAllBlogsbyUser;
