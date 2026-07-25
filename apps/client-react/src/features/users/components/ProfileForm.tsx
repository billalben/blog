import { Form, Input, Button, Divider } from "antd";
import {
  MailOutlined,
  UserOutlined,
  LockOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  GithubOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { updateProfileSchema } from "@/features/users/schemas/users.schema";
import { useUpdateCurrentUserMutation } from "@/features/users/mutations/users.mutations";
import { zodToFieldErrors } from "@/shared/lib/zod-helper";
import type { User } from "@/shared/types/api";

type Props = {
  user: User;
};

export const ProfileForm = ({ user }: Props) => {
  const mutation = useUpdateCurrentUserMutation();
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, unknown>) => {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(values)) {
      if (val && val !== "") cleaned[key] = val;
    }

    const body: Record<string, unknown> = {};
    const socialLinks: Record<string, string> = {};
    const socialFields = [
      "website",
      "linkedin",
      "github",
      "x",
      "facebook",
      "instagram",
      "youtube",
    ];

    for (const [key, val] of Object.entries(cleaned)) {
      if (socialFields.includes(key)) {
        socialLinks[key] = val as string;
      } else {
        body[key] = val;
      }
    }

    if (Object.keys(socialLinks).length > 0) {
      body.socialLinks = socialLinks;
    }

    const result = updateProfileSchema.safeParse(values);
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

    mutation.mutate(body as Parameters<typeof mutation.mutate>[0]);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        email: user.email,
        username: user.username,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        website: user.socialLinks?.website || "",
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
        x: user.socialLinks?.x || "",
        facebook: user.socialLinks?.facebook || "",
        instagram: user.socialLinks?.instagram || "",
        youtube: user.socialLinks?.youtube || "",
      }}
    >
      <Form.Item name="email" label="Email">
        <Input prefix={<MailOutlined />} />
      </Form.Item>
      <Form.Item name="username" label="Username">
        <Input prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item name="firstName" label="First Name">
        <Input />
      </Form.Item>
      <Form.Item name="lastName" label="Last Name">
        <Input />
      </Form.Item>
      <Form.Item name="password" label="New Password (leave blank to keep)">
        <Input.Password prefix={<LockOutlined />} placeholder="New password" />
      </Form.Item>

      <Divider>Social Links</Divider>

      <Form.Item name="website" label="Website">
        <Input prefix={<GlobalOutlined />} placeholder="https://..." />
      </Form.Item>
      <Form.Item name="linkedin" label="LinkedIn">
        <Input prefix={<LinkedinOutlined />} placeholder="https://..." />
      </Form.Item>
      <Form.Item name="github" label="GitHub">
        <Input prefix={<GithubOutlined />} placeholder="https://..." />
      </Form.Item>
      <Form.Item name="x" label="X (Twitter)">
        <Input prefix={<GithubOutlined />} placeholder="https://..." />
      </Form.Item>
      <Form.Item name="facebook" label="Facebook">
        <Input prefix={<FacebookOutlined />} placeholder="https://..." />
      </Form.Item>
      <Form.Item name="instagram" label="Instagram">
        <Input prefix={<InstagramOutlined />} placeholder="https://..." />
      </Form.Item>
      <Form.Item name="youtube" label="YouTube">
        <Input prefix={<YoutubeOutlined />} placeholder="https://..." />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};
