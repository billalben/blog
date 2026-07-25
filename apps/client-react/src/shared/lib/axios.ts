import axios from "axios";
import { env } from "@/config/env";
import { tokenStore } from "@/shared/lib/token-store";
import type { ApiResponse } from "@/shared/types/api";

const api = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      originalRequest._retry = true;

      refreshPromise = (async () => {
        try {
          const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
            "/auth/refresh-token"
          );
          const newToken = data.data.accessToken;
          tokenStore.set(newToken);
          return newToken;
        } catch (refreshError) {
          tokenStore.clear();
          window.dispatchEvent(new CustomEvent("auth:logout"));
          throw refreshError;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
    }

    const newToken = await refreshPromise!;
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  }
);

export default api;
