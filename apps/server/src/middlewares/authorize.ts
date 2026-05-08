import logger from "@/lib/winston";
import type { Request, Response, NextFunction } from "express";
import User from "@/models/user";

export type TAuthRole = "user" | "admin";

const authorize = (roles: TAuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
      const user = await User.findById(userId).select("role").exec();

      if (!user) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized: User not found",
        });

        logger.warn(`Authorization failed: User with ID ${userId} not found`);
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          status: "error",
          message: "Forbidden: Insufficient permissions",
        });

        logger.warn(
          `Authorization failed: User with ID ${userId} has role ${user.role}, required roles: ${roles.join(
            ", "
          )}`
        );
        return;
      }

      return next();
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
      logger.error("Authorization error:", error);
    }
  };
};

export default authorize;
