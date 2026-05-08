import { z } from "zod";

export const UpdateCurrentUserBodySchema = z.object({
  email: z.email().max(50).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});
