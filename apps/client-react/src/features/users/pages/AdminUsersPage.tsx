import { useState } from "react";
import { Table, Tag, Card, type TablePaginationConfig } from "antd";
import { useQuery } from "@tanstack/react-query";
import { allUsersQueryOptions } from "@/features/users/queries/users.queryOptions";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { PAGE_SIZE_DEFAULT } from "@/config/constants";
import type { User } from "@/shared/types/api";

const roleColorMap: Record<string, string> = {
  admin: "red",
  user: "blue",
};

export const AdminUsersPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery(
    allUsersQueryOptions({ page, page_size: PAGE_SIZE_DEFAULT })
  );

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: unknown, record: User) =>
        [record.firstName, record.lastName].filter(Boolean).join(" ") ||
        record.username,
    },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={roleColorMap[role] || "default"}>{role}</Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data?.data.length) return <EmptyState description="No users found" />;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Card title="Users">
        <Table<User>
          rowKey="id"
          columns={columns}
          dataSource={data.data}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE_DEFAULT,
            total: data.meta.count,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          bordered
        />
      </Card>
    </div>
  );
};
