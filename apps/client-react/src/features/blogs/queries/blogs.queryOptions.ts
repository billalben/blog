import { queryOptions } from "@tanstack/react-query";
import { blogsApi } from "@/features/blogs/api/blogs.api";
import { blogKeys } from "@/features/blogs/queries/blogs.keys";

export const blogsQueryOptions = (params: {
  page?: number;
  page_size?: number;
}) =>
  queryOptions({
    queryKey: blogKeys.list(params),
    queryFn: async () => {
      const { data } = await blogsApi.getBlogs(params);
      return data;
    },
  });

export const blogBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: blogKeys.detail(slug),
    queryFn: async () => {
      const { data } = await blogsApi.getBlogBySlug(slug);
      return data.data;
    },
    enabled: !!slug,
  });
