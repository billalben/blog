import { Result, Button } from "antd";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorState = ({
  message = "Something went wrong",
  onRetry,
}: Props) => (
  <Result
    status="error"
    title="Error"
    subTitle={message}
    extra={
      onRetry ? (
        <Button type="primary" onClick={onRetry}>
          Retry
        </Button>
      ) : undefined
    }
  />
);
