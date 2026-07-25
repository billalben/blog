import { useState } from "react";
import { Card, Tag, Typography, Space, Row, Col, Pagination } from "antd";
import {
  EyeOutlined,
  HeartOutlined,
  CommentOutlined,
  UserOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { blogsQueryOptions } from "@/features/blogs/queries/blogs.queryOptions";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { PAGE_SIZE_DEFAULT } from "@/config/constants";

const { Meta } = Card;
const { Text, Paragraph } = Typography;

export const BlogsListPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(PAGE_SIZE_DEFAULT);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery(
    blogsQueryOptions({ page, page_size: pageSize })
  );

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data?.data.length) return <EmptyState description="No blog posts yet" />;

  return (
    <div>
      <Typography.Title level={2}>Blogs</Typography.Title>

      <Row gutter={[16, 16]}>
        {data.data.map((blog) => (
          <Col key={blog._id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              onClick={() => navigate(`/blogs/${blog.slug}`)}
              cover={
                  blog.banner ? (
                    <img
                      alt={blog.title}
                      src={blog.banner.url}
                      style={{ height: 180, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      <FileImageOutlined
                        style={{ fontSize: 48, color: "rgba(255,255,255,0.5)" }}
                      />
                    </div>
                  )
                }
            >
              <Meta
                title={blog.title}
                description={
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ marginBottom: 12 }}
                  >
                    {blog.content}
                  </Paragraph>
                }
              />
              <Space wrap size="small">
                <Tag color={blog.status === "published" ? "green" : "orange"}>
                  {blog.status}
                </Tag>
                <Text type="secondary">
                  <UserOutlined /> {blog.author.username}
                </Text>
                <Text type="secondary">
                  <EyeOutlined /> {blog.viewsCount}
                </Text>
                <Text type="secondary">
                  <HeartOutlined /> {blog.likesCount}
                </Text>
                <Text type="secondary">
                  <CommentOutlined /> {blog.commentsCount}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {data.meta.count > pageSize && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={data.meta.count}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
};
