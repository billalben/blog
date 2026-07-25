import { Empty } from "antd";

type Props = {
  description?: string;
};

export const EmptyState = ({ description = "No data" }: Props) => (
  <Empty description={description} style={{ padding: 48 }} />
);
