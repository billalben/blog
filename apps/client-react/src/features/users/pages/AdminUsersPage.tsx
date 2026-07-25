import { useState } from "react";
import { Typography, Table, type TablePaginationConfig } from "antd";
import { useQuery } from "@tanstack/react-query";
import { allUsersQueryOptions } from "@/features/users/queries/users.queryOptions";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { PAGE_SIZE_DEFAULT } from "@/config/constants";
import type { User } from "@/shared/types/api";

export const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const { data, isLoading, isError, refetch } = useQuery(
    allUsersQueryOptions({ page, page_size: pageSize })
  );

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data?.data.length) return <EmptyState description="No users found" />;

  return (
    <div>
      <Typography.Title level={2}>Users</Typography.Title>
      <Table<User>
        rowKey="_id"
        columns={columns}
        dataSource={data.data}
        pagination={{
          current: page,
          pageSize,
          total: data.meta.count,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};
