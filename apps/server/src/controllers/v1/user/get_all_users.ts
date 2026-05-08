import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User from "@/models/user";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const total = await User.countDocuments();
    const users = await User.find()
      .select("-__v")
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          total,
          limit,
          offset,
        },
      },
    });

    logger.info("Retrieved all users successfully", {
      userId: req.userId,
      ip: req.ip,
      totalUsers: total,
    });
  } catch (error) {
    logger.error("Failed to retrieve users", {
      userId: req.userId,
      ip: req.ip,
      error,
    });

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve users",
    });
  }
};

export default getAllUsers;
