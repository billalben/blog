import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/features/users/api/users.api";
import { useAuth } from "@/app/providers/use-auth";
import { userKeys } from "@/features/users/queries/users.keys";
import { App } from "antd";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || "An error occurred";
  }
  return "An error occurred";
}

export function useUpdateCurrentUserMutation() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: usersApi.updateCurrentUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
      message.success(res.data.message);
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}

export function useDeleteCurrentUserMutation() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: usersApi.deleteCurrentUser,
    onSuccess: () => {
      message.success("Account deleted");
      logout();
      navigate("/login");
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}
