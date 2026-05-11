import logger from "@/lib/winston";
import Blog from "@/models/blog";

import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "@/lib/response";
import uploadToCloudinary from "@/lib/cloudinary";

import { type UploadApiErrorResponse } from "cloudinary";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const uploadBlogBanner = (method: "create" | "update") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (method === "create" && !req.file) {
        next();
        return;
      }

      if (!req.file) {
        return errorResponse(res, "No file uploaded", 400);
      }

      if (req.file.size > MAX_FILE_SIZE) {
        return errorResponse(res, "File size exceeds 2MB limit", 400);
      }

      // const { blogId } = req.params;
      // const blog = await Blog.findById(blogId).select("banner.publicId").exec();

      const data = await uploadToCloudinary(
        req.file.buffer
        // blog?.banner.publicId.replace("blog-api/", "")
      );

      if (!data) {
        logger.error("Cloudinary upload failed: No data returned", {
          // blogId,
          // publicId: blog?.banner.publicId,
        });
        return errorResponse(res, "Failed to upload image", 500);
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info("Blog banner uploaded successfully", {
        // blogId,
        banner: newBanner,
      });

      req.body.banner = newBanner;

      next();
    } catch (error: UploadApiErrorResponse | unknown) {
      logger.error("Error uploading blog banner:", error);
      return errorResponse(res, "Internal server error", 500);
    }
  };
};

export default uploadBlogBanner;
