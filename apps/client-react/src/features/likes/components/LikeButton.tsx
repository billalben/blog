import { useState, useCallback } from "react";
import { Button } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useAuth } from "@/app/providers/use-auth";
import {
  useLikeBlogMutation,
  useUnlikeBlogMutation,
} from "@/features/likes/mutations/likes.mutations";

type Props = {
  blogId: string;
};

export const LikeButton = ({ blogId }: Props) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  const likeMutation = useLikeBlogMutation(blogId);
  const unlikeMutation = useUnlikeBlogMutation(blogId);

  const handleToggle = useCallback(() => {
    if (!user) return;

    if (liked) {
      unlikeMutation.mutate(
        { userId: user._id },
        {
          onSuccess: () => setLiked(false),
        }
      );
    } else {
      likeMutation.mutate(
        { userId: user._id },
        {
          onSuccess: () => setLiked(true),
        }
      );
    }
  }, [liked, user, likeMutation, unlikeMutation]);

  if (!user) return null;

  return (
    <Button
      icon={
        liked ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />
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
