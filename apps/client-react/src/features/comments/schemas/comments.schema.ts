import { z } from "zod";
import { COMMENT } from "@/config/constants";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(
      COMMENT.CONTENT_MAX,
      `Comment must be at most ${COMMENT.CONTENT_MAX} characters`
    ),
});
