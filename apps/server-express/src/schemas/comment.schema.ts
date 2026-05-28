import { z } from "zod";
import { Types } from "mongoose";

export const CreateCommentBodySchema = z.object({
  content: z.string().nonempty("Content is required"),
});

export const CreateCommentParamsSchema = z.object({
  blogId: z.string().nonempty("Blog ID is required"),
});

export const GetCommentsByBlogIdParamsSchema = z.object({
  blogId: z.string().nonempty("Blog ID is required"),
});
