import { z } from "zod";
import { registry } from "@/lib/openapi-registry";
import {
  ErrorResponseSchema,
  ValidationErrorSchema,
} from "./common.schema";

// --- Request schemas ---

export const CreateCommentBodySchema = z.object({
  content: z.string().nonempty("Content is required"),
});

export const CreateCommentParamsSchema = z.object({
  blogId: z.string().nonempty("Blog ID is required"),
});

export const GetCommentsByBlogIdParamsSchema = z.object({
  blogId: z.string().nonempty("Blog ID is required"),
});

export const DeleteCommentParamsSchema = z.object({
  commentId: z.string().nonempty("Comment ID is required"),
});

// --- Response schemas ---

export const CommentSchema = z.object({
  _id: z.string(),
  blogId: z.string(),
  userId: z.string(),
  content: z.string(),
});

export const CommentCountResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    commentsCount: z.number(),
  }),
});

export const CommentsListResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    comments: z.array(CommentSchema),
  }),
});

// --- OpenAPI path registration ---

registry.registerPath({
  method: "post",
  path: "/api/v1/comments/blog/{blogId}",
  summary: "Add a comment to a blog post",
  tags: ["Comments"],
  security: [{ BearerAuth: [] }],
  request: {
    params: CreateCommentParamsSchema,
    body: {
      content: { "application/json": { schema: CreateCommentBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Comment created successfully",
      content: { "application/json": { schema: CommentCountResponseSchema } },
    },
    400: {
      description: "Validation error or invalid blog id",
      content: { "application/json": { schema: ValidationErrorSchema } },
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
  method: "get",
  path: "/api/v1/comments/blog/{blogId}",
  summary: "Get all comments for a blog post",
  tags: ["Comments"],
  security: [{ BearerAuth: [] }],
  request: {
    params: GetCommentsByBlogIdParamsSchema,
  },
  responses: {
    200: {
      description: "Comments retrieved successfully",
      content: { "application/json": { schema: CommentsListResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Blog or comments not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/comments/{commentId}",
  summary: "Delete a comment by ID",
  tags: ["Comments"],
  security: [{ BearerAuth: [] }],
  request: {
    params: DeleteCommentParamsSchema,
  },
  responses: {
    204: { description: "Comment deleted successfully" },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    403: {
      description: "Forbidden: not the comment author",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Comment not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});
