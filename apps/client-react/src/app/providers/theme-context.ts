import { createContext } from "react";

type ThemeMode = "light" | "dark";

export type ThemeCtx = {
  isDark: boolean;
  theme: ThemeMode;
  toggleTheme: () => void;
};

export const ThemeCtx = createContext<ThemeCtx | null>(null);
