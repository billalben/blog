import { Button } from "antd";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/providers/use-theme";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{ color: "inherit" }}
    />
  );
};
