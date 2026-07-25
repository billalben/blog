import type { Request, Response } from "express";
import type { Types } from "mongoose";

import Like from "@/models/like";
import { successResponse, errorResponse } from "@/lib/response";

const checkLike = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params as unknown as { blogId: Types.ObjectId };
    const userId = req.userId;

    if (!userId) {
      return successResponse(res, { liked: false }, "Like status retrieved", 200);
    }

    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();

    return successResponse(
      res,
      { liked: !!existingLike },
      "Like status retrieved",
      200
    );
  } catch (error) {
    return errorResponse(res, "Error checking like status", 500);
  }
};

export default checkLike;
