import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { commentsApi } from "@/features/comments/api/comments.api";
import { commentKeys } from "@/features/comments/queries/comments.keys";
import { blogKeys } from "@/features/blogs/queries/blogs.keys";
import type { AxiosError } from "axios";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || "An error occurred";
  }
  return "An error occurred";
}

export function useCreateCommentMutation(blogId: string) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (body: { content: string }) =>
      commentsApi.createComment(blogId, body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byBlog(blogId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      message.success(res.data.message);
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}

export function useDeleteCommentMutation(blogId: string) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byBlog(blogId) });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      message.success("Comment deleted");
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}
