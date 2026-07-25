import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User from "@/models/user";
import { paginate, paginatedResponse, errorResponse } from "@/lib/response";
import { GetAllUsersQuerySchema } from "@/schemas/user.schema";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page, page_size } = GetAllUsersQuerySchema.parse(req.query);

    const [users, count] = await Promise.all([
      User.find()
        .select("-__v")
        .skip((page - 1) * page_size)
        .limit(page_size)
        .lean()
        .exec(),
      User.countDocuments(),
    ]);

    const normalized = users.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    const totalPages = Math.ceil(count / page_size);

    if (page > totalPages) {
      return errorResponse(res, "Page not found", 404);
    }

    const meta = paginate(count, page, page_size, req);

    logger.info("Retrieved all users successfully", {
      userId: req.userId,
      ip: req.ip,
      totalUsers: count,
    });

    return paginatedResponse(res, normalized, meta, "Users retrieved successfully");
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
