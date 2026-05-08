import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User from "@/models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-__v").lean().exec();

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Current user fetched successfully",
      data: { user },
    });
  } catch (error) {
    logger.error("Error fetching current user:", error);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export default getCurrentUser;
