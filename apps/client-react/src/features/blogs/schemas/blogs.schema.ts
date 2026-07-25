import { z } from "zod";
import { BLOG } from "@/config/constants";

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(BLOG.TITLE_MIN, `Title must be at least ${BLOG.TITLE_MIN} characters`)
    .max(BLOG.TITLE_MAX, `Title must be at most ${BLOG.TITLE_MAX} characters`),
  content: z
    .string()
    .min(
      BLOG.CONTENT_MIN,
      `Content must be at least ${BLOG.CONTENT_MIN} characters`
    ),
  status: z.enum(["draft", "published"]).optional(),
});

export const updateBlogSchema = z.object({
  title: z
    .string()
    .min(BLOG.TITLE_MIN)
    .max(BLOG.TITLE_MAX)
    .optional()
    .or(z.literal("")),
  content: z.string().min(BLOG.CONTENT_MIN).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).optional(),
});
