import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Tag,
  Space,
  Image,
  Button,
  Divider,
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  HeartOutlined,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { blogBySlugQueryOptions } from "@/features/blogs/queries/blogs.queryOptions";
import { useDeleteBlogMutation } from "@/features/blogs/mutations/blogs.mutations";
import { useAuth } from "@/app/providers/use-auth";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { CommentSection } from "@/features/comments/components/CommentSection";
import { LikeButton } from "@/features/likes/components/LikeButton";

export const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const deleteMutation = useDeleteBlogMutation();

  const { data, isLoading, isError, refetch } = useQuery(
    blogBySlugQueryOptions(slug!)
  );

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data) return <ErrorState message="Blog not found" />;

  const blog = data.blog;
  const canEdit = user?.role === "admin" || user?._id === blog.author._id;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {blog.banner && (
        <Image
          src={blog.banner.url}
          alt={blog.title}
          style={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
          borderRadius: 8,
          marginBottom: 24,
        }}
          preview={false}
        />
      )}

      <Space style={{ marginBottom: 8 }}>
        <Tag color={blog.status === "published" ? "green" : "orange"}>
          {blog.status}
        </Tag>
      </Space>

      <Typography.Title level={2}>{blog.title}</Typography.Title>

      <Space wrap style={{ marginBottom: 24 }}>
        <Typography.Text type="secondary">
          <UserOutlined /> {blog.author.username}
        </Typography.Text>
        {blog.publishedAt && (
          <Typography.Text type="secondary">
            <ClockCircleOutlined />{" "}
            {new Date(blog.publishedAt).toLocaleDateString()}
          </Typography.Text>
        )}
        <Typography.Text type="secondary">
          <EyeOutlined /> {blog.viewsCount}
        </Typography.Text>
        <Typography.Text type="secondary">
          <HeartOutlined /> {blog.likesCount}
        </Typography.Text>
        <Typography.Text type="secondary">
          <CommentOutlined /> {blog.commentsCount}
        </Typography.Text>
      </Space>

      <div style={{ marginBottom: 24 }}>
        <LikeButton blogId={blog._id} />
      </div>

      <div
        style={{ lineHeight: 1.8, fontSize: 16, marginBottom: 32 }}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {canEdit && (
        <Space style={{ marginBottom: 24 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/blogs/${blog.slug}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete blog"
            description="This action cannot be undone."
            onConfirm={() => deleteMutation.mutate(blog._id)}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )}

      <Divider />
      <CommentSection blogId={blog._id} />
    </div>
  );
};
