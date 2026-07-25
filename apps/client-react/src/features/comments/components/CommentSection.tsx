import { useQuery } from "@tanstack/react-query";
import { Form, Input, Button, List, Typography, Popconfirm } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { commentsByBlogQueryOptions } from "@/features/comments/queries/comments.queryOptions";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "@/features/comments/mutations/comments.mutations";
import { createCommentSchema } from "@/features/comments/schemas/comments.schema";
import { zodToFieldErrors } from "@/shared/lib/zod-helper";
import { useAuth } from "@/app/providers/use-auth";
import { Spinner } from "@/shared/components/Spinner";
import { EmptyState } from "@/shared/components/EmptyState";

const { Text } = Typography;
const { TextArea } = Input;

type Props = {
  blogId: string;
};

export const CommentSection = ({ blogId }: Props) => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery(commentsByBlogQueryOptions(blogId));
  const createMutation = useCreateCommentMutation(blogId);
  const deleteMutation = useDeleteCommentMutation(blogId);

  const comments = data?.comments ?? [];

  const onFinish = (values: unknown) => {
    const result = createCommentSchema.safeParse(values);
    if (!result.success) {
      form.setFields(
        Object.entries(zodToFieldErrors(result.error)).map(
          ([name, errors]) => ({
            name: name as Parameters<typeof form.setFields>[0][number]["name"],
            errors: [errors],
          })
        )
      );
      return;
    }
    createMutation.mutate(result.data, {
      onSuccess: () => form.resetFields(),
    });
  };

  return (
    <div>
      <Typography.Title level={4}>Comments</Typography.Title>

      {user && (
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          style={{ marginBottom: 24 }}
        >
          <Form.Item name="content">
            <TextArea
              rows={3}
              placeholder="Write a comment..."
              maxLength={1000}
              showCount
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending}
            >
              Add Comment
            </Button>
          </Form.Item>
        </Form>
      )}

      {isLoading ? (
        <Spinner />
      ) : comments.length === 0 ? (
        <EmptyState description="No comments yet" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item
              actions={
                user && (user._id === comment.userId || user.role === "admin")
                  ? [
                      <Popconfirm
                        key="delete"
                        title="Delete comment?"
                        onConfirm={() => deleteMutation.mutate(comment._id)}
                        okText="Delete"
                        okType="danger"
                        cancelText="Cancel"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          loading={deleteMutation.isPending}
                        />
                      </Popconfirm>,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={<UserOutlined style={{ fontSize: 24 }} />}
                title={<Text strong>{comment.userId.slice(0, 8)}...</Text>}
                description={<Text>{comment.content}</Text>}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
