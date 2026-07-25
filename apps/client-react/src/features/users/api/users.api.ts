import api from "@/shared/lib/axios";
import type { ApiResponse, ApiListResponse, User } from "@/shared/types/api";

export const usersApi = {
  getCurrentUser: () => api.get<ApiResponse<{ user: User }>>("/users/current"),

  updateCurrentUser: (
    body: Partial<
      Pick<User, "email" | "username" | "firstName" | "lastName"> & {
        password?: string;
        socialLinks?: User["socialLinks"];
      }
    >
  ) => api.put<ApiResponse<{ user: User }>>("/users/current", body),

  deleteCurrentUser: () => api.delete("/users/current"),

  getAllUsers: (params: { page?: number; page_size?: number }) =>
    api.get<ApiListResponse<User>>("/users", { params }),
};
