import { Link } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Flex } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { useLoginMutation } from "@/features/auth/mutations/auth.mutations";
import { zodToFieldErrors } from "@/shared/lib/zod-helper";

export const LoginPage = () => {
  const mutation = useLoginMutation();
  const [form] = Form.useForm();

  const onFinish = (values: unknown) => {
    const result = loginSchema.safeParse(values);
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
    mutation.mutate(result.data);
  };

  return (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <Card style={{ width: 400 }} title="Blog">
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          Login
        </Typography.Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item name="email">
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isPending}
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Typography.Text style={{ display: "block", textAlign: "center" }}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </Typography.Text>
      </Card>
    </Flex>
  );
};
