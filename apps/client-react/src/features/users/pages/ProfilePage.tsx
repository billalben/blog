import { Button, Popconfirm, Card } from "antd";
import { useAuth } from "@/app/providers/use-auth";
import { ProfileForm } from "@/features/users/components/ProfileForm";
import { useDeleteCurrentUserMutation } from "@/features/users/mutations/users.mutations";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const deleteMutation = useDeleteCurrentUserMutation();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;
  if (!user)
    return <ErrorState message="User not found" onRetry={() => navigate(0)} />;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Card
        title="Profile"
        extra={
          <Popconfirm
            title="Delete account"
            description="This action cannot be undone. All your data will be permanently removed."
            onConfirm={() => deleteMutation.mutate()}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
          >
            <Button danger loading={deleteMutation.isPending}>
              Delete Account
            </Button>
          </Popconfirm>
        }
      >
        <ProfileForm user={user} />
      </Card>
    </div>
  );
};
