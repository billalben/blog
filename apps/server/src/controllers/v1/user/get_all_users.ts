import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User from "@/models/user";
import { paginate, paginatedResponse, errorResponse } from "@/lib/response";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page, page_size } = req.query as unknown as {
      page: number;
      page_size: number;
    };


    const skip = (page - 1) * page_size;

    const [users, count] = await Promise.all([
      User.find().select("-__v").skip(skip).limit(page_size).lean().exec(),
      User.countDocuments(),
    ]);

    const meta = paginate(count, page, page_size, req);

    logger.info("Retrieved all users successfully", {
      userId: req.userId,
      ip: req.ip,
      totalUsers: count,
    });

    return paginatedResponse(res, users, meta, "Users retrieved successfully");
  } catch (error) {
    logger.error("Failed to retrieve users", {
      userId: req.userId,
      ip: req.ip,
      error,
    });

    return errorResponse(res, "Failed to retrieve users");
  }
};

export default getAllUsers;
