export type Role = "user" | "admin";

type SocialLinks = {
  website?: string;
  linkedin?: string;
  github?: string;
  x?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  socialLinks?: SocialLinks;
  createdAt: string;
  updatedAt: string;
};

type UserPublic = {
  id: string;
  username: string;
  email: string;
  role: Role;
};

type Banner = {
  url: string;
  width: number;
  height: number;
};

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  banner?: Banner;
  author: UserPublic;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: "draft" | "published";
  publishedAt?: string;
  updatedAt?: string;
};

export type Comment = {
  _id: string;
  blogId: string;
  userId: string;
  content: string;
};

type PaginatedMeta = {
  count: number;
  next: string | null;
  previous: string | null;
};

export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiListResponse<T> = {
  success: true;
  message: string;
  data: T[];
  meta: PaginatedMeta;
};

export type ApiError = {
  success: false;
  message: string;
};

export type ApiValidationError = {
  success: false;
  message: "Validation failed";
  errors: { path: string; message: string }[];
};

export type AuthData = {
  user: User;
  accessToken: string;
};

export type RefreshTokenData = {
  accessToken: string;
};
