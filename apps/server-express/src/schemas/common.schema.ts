import { z } from "zod";

// --- Field schemas ---

export const emailSchema = z.email().max(50);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const roleSchema = z.enum(["user", "admin"]);

export const usernameSchema = z.string().min(3).max(20);

export const urlSchema = z.string().max(100).optional();

export const socialLinksSchema = z.object({
  website: urlSchema,
  linkedin: urlSchema,
  github: urlSchema,
  x: urlSchema,
  facebook: urlSchema,
  instagram: urlSchema,
  youtube: urlSchema,
});

// --- Response schemas ---

export const UserResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: emailSchema,
  role: roleSchema,
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

export const ValidationErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(
    z.object({
      path: z.string(),
      message: z.string(),
    })
  ),
});

export const PaginationMetaSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(50).default(10),
});
