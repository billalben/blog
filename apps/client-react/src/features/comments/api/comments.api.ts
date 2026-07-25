import api from "@/shared/lib/axios";
import type { ApiResponse, Comment } from "@/shared/types/api";

export const commentsApi = {
  createComment: (blogId: string, body: { content: string }) =>
    api.post<ApiResponse<{ commentsCount: number }>>(
      `/comments/blog/${blogId}`,
      body
    ),

  getCommentsByBlog: (blogId: string) =>
    api.get<ApiResponse<{ comments: Comment[] }>>(`/comments/blog/${blogId}`),

  deleteComment: (commentId: string) => api.delete(`/comments/${commentId}`),
};
