import api from "@/shared/lib/axios";
import type { ApiResponse, AuthData } from "@/shared/types/api";

export const authApi = {
  login: (body: { email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>("/auth/login", body),

  register: (body: { email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>("/auth/register", body),

  refreshToken: () =>
    api.post<ApiResponse<{ accessToken: string }>>("/auth/refresh-token"),

  logout: () => api.post("/auth/logout"),
};
