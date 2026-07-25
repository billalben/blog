import api from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api";

export const likesApi = {
  checkLike: (blogId: string) =>
    api.get<ApiResponse<{ liked: boolean }>>(`/likes/blog/${blogId}`),

  likeBlog: (blogId: string, body: { userId: string }) =>
    api.post<ApiResponse<{ likesCount: number }>>(
      `/likes/blog/${blogId}`,
      body
    ),

  unlikeBlog: (blogId: string, body: { userId: string }) =>
    api.delete<ApiResponse<{ likesCount: number }>>(`/likes/blog/${blogId}`, {
      data: body,
    }),
};
