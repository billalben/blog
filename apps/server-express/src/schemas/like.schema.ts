import { z } from "zod";
import { registry } from "@/lib/openapi-registry";
import { ErrorResponseSchema, ValidationErrorSchema } from "./common.schema";

// --- Request schemas ---

export const LikeBlogBodySchema = z.object({
  userId: z.string().nonempty("User ID is required"),
});

export const LikeBlogParamsSchema = z.object({
  blogId: z.string().nonempty("Blog ID is required"),
});

// --- Response schemas ---

export const LikeCountResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    likesCount: z.number(),
  }),
});

// --- OpenAPI path registration ---

registry.registerPath({
  method: "post",
  path: "/api/v1/likes/blog/{blogId}",
  summary: "Like a blog post",
  tags: ["Likes"],
  security: [{ BearerAuth: [] }],
  request: {
    params: LikeBlogParamsSchema,
    body: {
      content: { "application/json": { schema: LikeBlogBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Blog liked successfully",
      content: { "application/json": { schema: LikeCountResponseSchema } },
    },
    400: {
      description: "Already liked or validation error",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Blog not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/likes/blog/{blogId}",
  summary: "Unlike a blog post",
  tags: ["Likes"],
  security: [{ BearerAuth: [] }],
  request: {
    params: LikeBlogParamsSchema,
    body: {
      content: { "application/json": { schema: LikeBlogBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Blog unliked successfully",
      content: { "application/json": { schema: LikeCountResponseSchema } },
    },
    400: {
      description: "Not liked yet or validation error",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Blog not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});
