import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User from "@/models/user";
import { successResponse, errorResponse } from "@/lib/response";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-__v").lean().exec();

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, { user }, "Current user fetched successfully");
  } catch (error) {
    logger.error("Error fetching current user:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export default getCurrentUser;
