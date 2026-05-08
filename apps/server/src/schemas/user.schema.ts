import { z } from "zod";
import { registry } from "@/lib/openapi-registry";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
  socialLinksSchema,
  UserResponseSchema,
  ErrorResponseSchema,
  ValidationErrorSchema,
} from "./common.schema";

// --- Request schemas ---

export const UpdateCurrentUserBodySchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  password: passwordSchema.optional(),
  firstName: z.string().max(30).optional(),
  lastName: z.string().max(30).optional(),
  socialLinks: socialLinksSchema.optional(),
});

// --- Response schemas ---

export const UserProfileResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    user: UserResponseSchema.extend({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      socialLinks: socialLinksSchema.optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  }),
});

// --- OpenAPI path registration ---

registry.registerPath({
  method: "get",
  path: "/api/v1/users/current",
  summary: "Get current user profile",
  tags: ["Users"],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: "Current user profile",
      content: { "application/json": { schema: UserProfileResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "User not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/users/current",
  summary: "Update current user profile",
  tags: ["Users"],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: UpdateCurrentUserBodySchema } },
    },
  },
  responses: {
    200: {
      description: "User updated successfully",
      content: { "application/json": { schema: UserProfileResponseSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ValidationErrorSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "User not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    409: {
      description: "Email or username already exists",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});
