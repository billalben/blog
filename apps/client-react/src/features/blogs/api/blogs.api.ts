import api from "@/shared/lib/axios";
import type { ApiResponse, ApiListResponse, Blog } from "@/shared/types/api";

export const blogsApi = {
  createBlog: (formData: FormData) =>
    api.post<ApiResponse<{ blog: Blog }>>("/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getBlogs: (params: { page?: number; page_size?: number }) =>
    api.get<ApiListResponse<Blog>>("/blogs", { params }),

  getBlogsByUser: (
    userId: string,
    params: { page?: number; page_size?: number }
  ) => api.get<ApiListResponse<Blog>>(`/blogs/user/${userId}`, { params }),

  getBlogBySlug: (slug: string) =>
    api.get<ApiResponse<{ blog: Blog }>>(`/blogs/${slug}`),

  updateBlog: (
    blogId: string,
    body: { title?: string; content?: string; status?: "draft" | "published" }
  ) => api.put<ApiResponse<{ blog: Blog }>>(`/blogs/${blogId}`, body),

  deleteBlog: (blogId: string) => api.delete(`/blogs/${blogId}`),
};
