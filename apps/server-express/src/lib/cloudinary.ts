import { v2 as cloudinary } from "cloudinary";

import config from "@/config";
import logger from "./winston";

import type { UploadApiResponse, UploadApiOptions } from "cloudinary";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === "production",
});

const uploadToCloudinary = async (
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    const uploadOptions: UploadApiOptions = {
      allowed_formats: ["jpg", "webp", "png"],
      resource_type: "image",
      folder: "blog_api",
      transformation: {
        quality: "auto",
      },
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          logger.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

export default uploadToCloudinary;
