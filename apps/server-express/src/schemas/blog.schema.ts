import { z } from "zod";

// CreateBlogBodySchema
export const CreateBlogBodySchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty("Title is required")
    .min(5, "Title must be at least 5 characters long")
    .max(180, "Title must be at most 180 characters long"),
  content: z
    .string()
    .trim()
    .nonempty("Content is required")
    .min(20, "Content must be at least 20 characters long"),
  status: z.enum(["draft", "published"]).optional(),
  // banner_image: z
  //   .instanceof(File)
  //   .refine(
  //     (file) => ["image/jpg", "image/png", "image/webp"].includes(file.type),
  //     "Banner image must be a JPG, PNG, or WebP file"
  //   )
  //   .refine(
  //     (file) => file.size <= 2 * 1024 * 1024,
  //     "Banner image must be less than 2MB"
  //   )
  //   .nonoptional ("Banner image is required"),
});
