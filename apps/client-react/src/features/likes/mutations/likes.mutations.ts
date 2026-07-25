import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { likesApi } from "@/features/likes/api/likes.api";
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

export function useLikeBlogMutation(blogId: string) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (body: { userId: string }) => likesApi.likeBlog(blogId, body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      message.success(res.data.message);
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}

export function useUnlikeBlogMutation(blogId: string) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (body: { userId: string }) => likesApi.unlikeBlog(blogId, body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      message.success(res.data.message);
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}
