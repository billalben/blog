import { useCallback } from "react";
import { Button } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/app/providers/use-auth";
import { likesApi } from "@/features/likes/api/likes.api";
import { useLikeBlogMutation, useUnlikeBlogMutation } from "@/features/likes/mutations/likes.mutations";
import { blogKeys } from "@/features/blogs/queries/blogs.keys";

type Props = {
  blogId: string;
};

const likeCheckKey = (blogId: string) => ["likes", "check", blogId] as const;

export const LikeButton = ({ blogId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: liked = false } = useQuery({
    queryKey: likeCheckKey(blogId),
    queryFn: async () => {
      const { data } = await likesApi.checkLike(blogId);
      return data.data.liked;
    },
    enabled: !!user,
  });

  const likeMutation = useLikeBlogMutation(blogId);
  const unlikeMutation = useUnlikeBlogMutation(blogId);

  const handleToggle = useCallback(() => {
    if (!user) return;
    const key = likeCheckKey(blogId);

    if (liked) {
      unlikeMutation.mutate(
        { userId: user.id },
        {
          onSuccess: () => {
            queryClient.setQueryData(key, false);
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
          },
        }
      );
    } else {
      likeMutation.mutate(
        { userId: user.id },
        {
          onSuccess: () => {
            queryClient.setQueryData(key, true);
            queryClient.invalidateQueries({ queryKey: blogKeys.all });
          },
        }
      );
    }
  }, [liked, user, blogId, queryClient, likeMutation, unlikeMutation]);

  if (!user) return null;

  return (
    <Button
      icon={
        liked ? (
          <HeartFilled style={{ color: "#ff4d4f" }} />
        ) : (
          <HeartOutlined />
        )
      }
      onClick={handleToggle}
      loading={likeMutation.isPending || unlikeMutation.isPending}
      type={liked ? "primary" : "default"}
      danger={liked}
    >
      {liked ? "Unlike" : "Like"}
    </Button>
  );
};
