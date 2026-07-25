import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.{ts,tsx}"],
  paths: {
    "@/*": ["./src/*"],
  },
  ignoreDependencies: [
    "react",
    "react-dom",
    "@ant-design/icons",
    "lucide-react",
    "@tanstack/eslint-plugin-query",
    "@tanstack/react-query-devtools",
  ],
  ignore: ["src/features/*/index.ts"],
};

export default config;
