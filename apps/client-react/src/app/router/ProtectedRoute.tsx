import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/use-auth";
import { Spinner } from "@/shared/components/Spinner";
import type { Role } from "@/shared/types/api";

type Props = {
  roles?: Role[];
  guestOnly?: boolean;
};

export const ProtectedRoute = ({ roles, guestOnly }: Props) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/blogs" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/blogs" replace />;
  }

  return <Outlet />;
};
