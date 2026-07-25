import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import { blogsApi } from "@/features/blogs/api/blogs.api";
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

export function useCreateBlogMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: blogsApi.createBlog,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      message.success(res.data.message);
      navigate(`/blogs/${res.data.data.blog.slug}`);
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}

export function useUpdateBlogMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({
      blogId,
      body,
    }: {
      blogId: string;
      body: Parameters<typeof blogsApi.updateBlog>[1];
    }) => blogsApi.updateBlog(blogId, body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: blogKeys.detail(res.data.data.blog.slug),
      });
      message.success(res.data.message);
      navigate(`/blogs/${res.data.data.blog.slug}`);
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: blogsApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      message.success("Blog deleted");
      navigate("/blogs");
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}
