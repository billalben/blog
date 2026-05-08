import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User from "@/models/user";

const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndDelete(userId).exec();

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    logger.info(`User ${user.username} deleted their account`);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    logger.error("Error deleting user:", error);
  }
};

export default deleteCurrentUser;
