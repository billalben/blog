import { useContext } from "react";
import { AuthCtx } from "@/app/providers/auth-context";

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
