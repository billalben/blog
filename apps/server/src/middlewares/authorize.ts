import logger from "@/lib/winston";
import type { Request, Response, NextFunction } from "express";
import User from "@/models/user";
import { errorResponse } from "@/lib/response";

export type TAuthRole = "user" | "admin";

const authorize = (roles: TAuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
      const user = await User.findById(userId).select("role").exec();

      if (!user) {
        logger.warn(`Authorization failed: User with ID ${userId} not found`);
        return errorResponse(res, "Unauthorized: User not found", 401);
      }

      if (!roles.includes(user.role)) {
        logger.warn(
          `Authorization failed: User with ID ${userId} has role ${user.role}, required roles: ${roles.join(
            ", "
          )}`
        );
        return errorResponse(res, "Forbidden: Insufficient permissions", 403);
      }

      return next();
    } catch (error) {
      logger.error("Authorization error:", error);
      return errorResponse(res, "Internal Server Error");
    }
  };
};

export default authorize;
