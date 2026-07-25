import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { registerSchema } from "@/features/auth/schemas/auth.schema";
import { useRegisterMutation } from "@/features/auth/mutations/auth.mutations";
import { zodToFieldErrors } from "@/shared/lib/zod-helper";

export const RegisterPage = () => {
  const mutation = useRegisterMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: unknown) => {
    const result = registerSchema.safeParse(values);
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
    const { confirmPassword, ...body } = result.data;
    void confirmPassword;
    mutation.mutate(body);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <Typography.Title level={2}>Register</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item name="email">
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>
        <Form.Item name="password">
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>
        <Form.Item name="confirmPassword">
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm password"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            block
            size="large"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text>
        Already have an account? <Link to="/login">Login</Link>
      </Typography.Text>
      <div style={{ marginTop: 16 }}>
        <Button block onClick={() => navigate("/blogs")}>
          Back to Blogs
        </Button>
      </div>
    </div>
  );
};
