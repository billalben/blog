import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuth } from "@/app/providers/use-auth";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import type { AxiosError } from "axios";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || "An error occurred";
  }
  return "An error occurred";
}

export function useLoginMutation() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      const { accessToken, user } = res.data.data;
      login(accessToken, user);
      message.success(res.data.message);
      navigate("/blogs");
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}

export function useRegisterMutation() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      const { accessToken, user } = res.data.data;
      login(accessToken, user);
      message.success(res.data.message);
      navigate("/blogs");
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}
