import { useState, useEffect, useCallback, type ReactNode } from "react";
import api from "@/shared/lib/axios";
import { tokenStore } from "@/shared/lib/token-store";
import { AuthCtx } from "@/app/providers/auth-context";
import type { User, ApiResponse } from "@/shared/types/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    tokenStore.clear();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const { data } =
          await api.get<ApiResponse<{ user: User }>>("/users/current");
        if (!cancelled) setUser(data.data.user);
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();

    const handleLogout = () => {
      setUser(null);
      setIsLoading(false);
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => {
      cancelled = true;
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [clearAuth]);

  const login = useCallback((accessToken: string, u: User) => {
    tokenStore.set(accessToken);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // even if logout fails, clear local state
    }
    clearAuth();
  }, [clearAuth]);

  return (
    <AuthCtx.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
