import { createContext } from "react";
import type { User } from "@/shared/types/api";

export type AuthCtx = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
};

export const AuthCtx = createContext<AuthCtx | null>(null);
