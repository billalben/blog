import { queryOptions } from "@tanstack/react-query";
import { commentsApi } from "@/features/comments/api/comments.api";
import { commentKeys } from "@/features/comments/queries/comments.keys";

export const commentsByBlogQueryOptions = (blogId: string) =>
  queryOptions({
    queryKey: commentKeys.byBlog(blogId),
    queryFn: async () => {
      const { data } = await commentsApi.getCommentsByBlog(blogId);
      return data.data;
    },
    enabled: !!blogId,
  });
