import { z } from "zod";
import { EMAIL_MAX, USERNAME } from "@/config/constants";

export const updateProfileSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .max(EMAIL_MAX)
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .min(USERNAME.MIN, `Username must be at least ${USERNAME.MIN} characters`)
    .max(USERNAME.MAX, `Username must be at most ${USERNAME.MAX} characters`)
    .optional()
    .or(z.literal("")),
  firstName: z.string().max(30).optional().or(z.literal("")),
  lastName: z.string().max(30).optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one digit")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
    .optional()
    .or(z.literal("")),
  website: z.string().max(100).optional().or(z.literal("")),
  linkedin: z.string().max(100).optional().or(z.literal("")),
  github: z.string().max(100).optional().or(z.literal("")),
  x: z.string().max(100).optional().or(z.literal("")),
  facebook: z.string().max(100).optional().or(z.literal("")),
  instagram: z.string().max(100).optional().or(z.literal("")),
  youtube: z.string().max(100).optional().or(z.literal("")),
});
