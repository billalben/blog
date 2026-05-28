import { z } from "zod";
import { Types } from "mongoose";
import { registry } from "@/lib/openapi-registry";
import {
  ErrorResponseSchema,
  ValidationErrorSchema,
  PaginationMetaSchema,
  PaginationQuerySchema,
  UserResponseSchema,
} from "./common.schema";

// --- Request schemas ---

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
});

export const CreateBlogMultipartSchema = CreateBlogBodySchema.extend({
  banner_image: z.string().openapi({ type: "string", format: "binary" }),
});

export const GetAllBlogsQuerySchema = z.object(PaginationQuerySchema.shape);

export const GetBlogsByUserIdParamsSchema = z
  .object({
    userId: z.string().trim().nonempty("User ID is required"),
  })
  .refine((data) => Types.ObjectId.isValid(data.userId), "User ID is invalid");

export const GetBlogBySlugParamsSchema = z.object({
  slug: z.string().trim().nonempty("Slug is required"),
});

export const UpdateBlogByIdParamsSchema = z
  .object({
    blogId: z.string().trim().nonempty("Blog ID is required"),
  })
  .refine((data) => Types.ObjectId.isValid(data.blogId), "Blog ID is invalid");

export const UpdateBlogBodySchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty("Title is required")
    .min(5, "Title must be at least 5 characters long")
    .max(180, "Title must be at most 180 characters long")
    .optional(),
  content: z
    .string()
    .trim()
    .nonempty("Content is required")
    .min(20, "Content must be at least 20 characters long")
    .optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const DeleteBlogByIdParamsSchema = z
  .object({
    blogId: z.string().trim().nonempty("Blog ID is required"),
  })
  .refine((data) => Types.ObjectId.isValid(data.blogId), "Blog ID is invalid");

// --- Response schemas ---

const BlogBannerSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const BlogSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  banner: BlogBannerSchema,
  author: UserResponseSchema,
  viewsCount: z.number(),
  likesCount: z.number(),
  commentsCount: z.number(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const BlogSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    blog: BlogSchema,
  }),
});

export const BlogsListResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.array(BlogSchema),
  meta: PaginationMetaSchema,
});

// --- OpenAPI path registration ---

registry.registerPath({
  method: "post",
  path: "/api/v1/blogs",
  summary: "Create a new blog post (admin only)",
  tags: ["Blogs"],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        "multipart/form-data": { schema: CreateBlogMultipartSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Blog post created successfully",
      content: { "application/json": { schema: BlogSuccessResponseSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ValidationErrorSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    403: {
      description: "Forbidden: admin role required",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/blogs",
  summary: "List all blogs (paginated)",
  tags: ["Blogs"],
  security: [{ BearerAuth: [] }],
  request: {
    query: GetAllBlogsQuerySchema,
  },
  responses: {
    200: {
      description: "Paginated list of blogs",
      content: { "application/json": { schema: BlogsListResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Page not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/blogs/user/{userId}",
  summary: "List blogs by author (paginated)",
  tags: ["Blogs"],
  security: [{ BearerAuth: [] }],
  request: {
    params: GetBlogsByUserIdParamsSchema,
    query: GetAllBlogsQuerySchema,
  },
  responses: {
    200: {
      description: "Paginated list of blogs for the given user",
      content: { "application/json": { schema: BlogsListResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Page not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/blogs/{slug}",
  summary: "Get a blog post by slug",
  tags: ["Blogs"],
  security: [{ BearerAuth: [] }],
  request: {
    params: GetBlogBySlugParamsSchema,
  },
  responses: {
    200: {
      description: "Blog retrieved successfully",
      content: { "application/json": { schema: BlogSuccessResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    403: {
      description: "Forbidden: draft blog not accessible",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Blog not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/blogs/{blogId}",
  summary: "Update a blog post by ID",
  tags: ["Blogs"],
  security: [{ BearerAuth: [] }],
  request: {
    params: UpdateBlogByIdParamsSchema,
    body: {
      content: { "application/json": { schema: UpdateBlogBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Blog updated successfully",
      content: { "application/json": { schema: BlogSuccessResponseSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ValidationErrorSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    403: {
      description: "Forbidden: not the blog author",
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
  path: "/api/v1/blogs/{blogId}",
  summary: "Delete a blog post by ID",
  tags: ["Blogs"],
  security: [{ BearerAuth: [] }],
  request: {
    params: DeleteBlogByIdParamsSchema,
  },
  responses: {
    204: { description: "Blog deleted successfully" },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    403: {
      description: "Forbidden: not the blog author",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "Blog not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});
