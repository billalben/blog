import { useQuery } from "@tanstack/react-query";
import { Form, Input, Button, Typography, Popconfirm, Space, Flex, Divider } from "antd";
import { DeleteOutlined, ClockCircleOutlined, MailOutlined } from "@ant-design/icons";
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

const { Text, Title } = Typography;
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
      <Title level={4}>Comments</Title>

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
        <div>
          {comments.map((comment, index) => (
            <div key={comment._id}>
              {index > 0 && <Divider style={{ margin: "12px 0" }} />}
              <Flex vertical gap={8}>
                <Flex justify="space-between" align="center">
                  <Space size="small" wrap>
                    <Text strong>{comment.author.username}</Text>
                    <Text type="secondary">
                      <MailOutlined style={{ marginRight: 4 }} />
                      {comment.author.email}
                    </Text>
                    <Text type="secondary">
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {new Date(comment.createdAt).toLocaleDateString()}{" "}
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Space>
                  {user &&
                    (user.id === comment.author.id || user.role === "admin") && (
                      <Popconfirm
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
                      </Popconfirm>
                    )}
                </Flex>
                <Text>{comment.content}</Text>
              </Flex>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
