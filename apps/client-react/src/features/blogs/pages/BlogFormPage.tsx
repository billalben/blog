import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Form, Input, Select, Upload, Button, Space, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { blogBySlugQueryOptions } from "@/features/blogs/queries/blogs.queryOptions";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "@/features/blogs/mutations/blogs.mutations";
import {
  createBlogSchema,
  updateBlogSchema,
} from "@/features/blogs/schemas/blogs.schema";
import { zodToFieldErrors } from "@/shared/lib/zod-helper";
import { Spinner } from "@/shared/components/Spinner";
import { BLOG } from "@/config/constants";

const { TextArea } = Input;
const { Text } = Typography;

export const BlogFormPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const isEdit = !!slug;
  const navigate = useNavigate();

  const createMutation = useCreateBlogMutation();
  const updateMutation = useUpdateBlogMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: blogData, isLoading: blogLoading } = useQuery({
    ...blogBySlugQueryOptions(slug || ""),
    enabled: isEdit,
  });
  const blog = blogData?.blog;

  const [form] = Form.useForm();
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const previewUrl = useMemo(
    () => (bannerFile ? URL.createObjectURL(bannerFile) : null),
    [bannerFile]
  );

  useEffect(() => {
    if (isEdit && blog) {
      form.setFieldsValue({
        title: blog.title,
        content: blog.content,
        status: blog.status,
      });
    }
  }, [isEdit, blog, form]);

  const onFinish = (values: unknown) => {
    if (isEdit && blog) {
      const result = updateBlogSchema.safeParse(values);
      if (!result.success) {
        form.setFields(
          Object.entries(zodToFieldErrors(result.error)).map(
            ([name, errors]) => ({
              name: name as Parameters<
                typeof form.setFields
              >[0][number]["name"],
              errors: [errors],
            })
          )
        );
        return;
      }
      const body: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(result.data)) {
        if (val && val !== "") body[key] = val;
      }
      updateMutation.mutate({
        blogId: blog._id,
        body: body as {
          title?: string;
          content?: string;
          status?: "draft" | "published";
        },
        bannerFile: bannerFile || undefined,
      });
    } else {
      const result = createBlogSchema.safeParse(values);
      if (!result.success) {
        form.setFields(
          Object.entries(zodToFieldErrors(result.error)).map(
            ([name, errors]) => ({
              name: name as Parameters<
                typeof form.setFields
              >[0][number]["name"],
              errors: [errors],
            })
          )
        );
        return;
      }
      const formData = new FormData();
      formData.append("title", result.data.title);
      formData.append("content", result.data.content);
      if (result.data.status) formData.append("status", result.data.status);
      if (bannerFile) {
        formData.append("banner_image", bannerFile);
      }
      createMutation.mutate(formData);
    }
  };

  const handleUpload = (file: File) => {
    if (file.size > BLOG.BANNER_MAX_MB * 1024 * 1024) {
      return false;
    }
    setBannerFile(file);
    return false;
  };

  if (isEdit && blogLoading) return <Spinner />;

  const existingBannerUrl = blog?.banner?.url;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Typography.Title level={2}>
        {isEdit ? "Edit Blog" : "New Blog"}
      </Typography.Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Blog title" maxLength={BLOG.TITLE_MAX} />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Content is required" }]}
        >
          <TextArea
            rows={12}
            placeholder="Write your blog content..."
            showCount
          />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select placeholder="Select status" allowClear>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="published">Published</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Banner Image">
          {previewUrl ? (
            <div style={{ marginBottom: 12 }}>
              <Image
                src={previewUrl}
                alt="Banner preview"
                width={300}
                style={{ borderRadius: 8 }}
              />
            </div>
          ) : existingBannerUrl && !bannerFile ? (
            <div style={{ marginBottom: 12 }}>
              <Image
                src={existingBannerUrl}
                alt="Current banner"
                width={300}
                style={{ borderRadius: 8 }}
              />
            </div>
          ) : null}

          <Upload
            beforeUpload={handleUpload}
            maxCount={1}
            accept="image/*"
            fileList={
              bannerFile
                ? [
                    {
                      uid: "-1",
                      name: bannerFile.name,
                      status: "done",
                    } as never,
                  ]
                : []
            }
            onRemove={() => setBannerFile(null)}
          >
            <Button icon={<UploadOutlined />}>
              {isEdit ? "Replace Banner" : "Upload Banner"}
            </Button>
          </Upload>
          <Text type="secondary" style={{ display: "block", marginTop: 4 }}>
            Max {BLOG.BANNER_MAX_MB}MB. Image file.
          </Text>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
