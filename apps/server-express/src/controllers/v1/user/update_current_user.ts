import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User from "@/models/user";
import { successResponse, errorResponse } from "@/lib/response";

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { email, password, username, firstName, lastName, socialLinks } =
      req.body;

    const user = await User.findById(userId).select("+password -__v").exec();

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (email) user.email = email;
    if (username) user.username = username;
    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (socialLinks) user.socialLinks = socialLinks;

    await user.save();

    logger.info(`User ${user.username} updated their profile`);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          socialLinks: user.socialLinks,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      "User updated successfully",
      200
    );
  } catch (error) {
    if (
      error instanceof Error &&
      (error as Error & { cause?: { code?: number } }).cause?.code === 11000
    ) {
      return errorResponse(
        res,
        "A user with this email or username already exists",
        409
      );
    }

    logger.error("Error updating current user:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export default updateCurrentUser;
