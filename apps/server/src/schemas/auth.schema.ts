import { z } from "zod";
import { registry } from "@/lib/openapi-registry";
import {
  emailSchema,
  passwordSchema,
  roleSchema,
  UserResponseSchema,
  ErrorResponseSchema,
  ValidationErrorSchema,
} from "./common.schema";

// --- Request schemas ---

export const RegisterBodySchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.optional().default("user"),
});

export const LoginBodySchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const RefreshTokenCookiesSchema = z.object({
  refreshToken: z.string(),
});

// --- Response schemas ---

export const AuthResponseSchema = z.object({
  user: UserResponseSchema,
  accessToken: z.string(),
});

export const AccessTokenResponseSchema = z.object({
  accessToken: z.string(),
});

// --- OpenAPI path registration ---

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/register",
  summary: "Register a new user",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: RegisterBodySchema } },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: { "application/json": { schema: AuthResponseSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ValidationErrorSchema } },
    },
    403: {
      description: "Email not authorized for admin role",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  summary: "Log in with email and password",
  tags: ["Auth"],
  request: {
    body: {
      content: { "application/json": { schema: LoginBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Logged in successfully",
      content: { "application/json": { schema: AuthResponseSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ValidationErrorSchema } },
    },
    401: {
      description: "Invalid email or password",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/refresh-token",
  summary: "Refresh access token using refresh token cookie",
  tags: ["Auth"],
  request: {
    cookies: RefreshTokenCookiesSchema,
  },
  responses: {
    200: {
      description: "New access token issued",
      content: { "application/json": { schema: AccessTokenResponseSchema } },
    },
    400: {
      description: "Missing refresh token",
      content: { "application/json": { schema: ValidationErrorSchema } },
    },
    401: {
      description: "Invalid or expired refresh token",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/logout",
  summary: "Log out and invalidate refresh token",
  tags: ["Auth"],
  security: [{ BearerAuth: [] }],
  responses: {
    204: { description: "Logged out successfully" },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});
