import type { Request, Response } from "express";

import logger from "@/lib/winston";
import User, { IUser } from "@/models/user";

// all optional
type TUpdateCurrentUserBody = Partial<IUser>;

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const {
      email,
      password,
      username,
      firstName,
      lastName,
      socialLinks,
    }: TUpdateCurrentUserBody = req.body;

    const user = await User.findById(userId).select("+password -__v").exec();

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (email) user.email = email;
    if (username) user.username = username;
    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (socialLinks) user.socialLinks = socialLinks;

    await user.save();

    logger.info(`User ${user.username} updated their profile`);

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: {
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
    });
  } catch (error) {
    logger.error("Error updating current user:", error);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export default updateCurrentUser;
