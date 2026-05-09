import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User from "@/models/user";
import { errorResponse } from "@/lib/response";

const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndDelete(userId).exec();

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    logger.info(`User ${user.username} deleted their account`);

    res.sendStatus(204);
  } catch (error) {
    logger.error("Error deleting user:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export default deleteCurrentUser;
