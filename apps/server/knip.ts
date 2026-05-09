import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.ts"],
  ignoreDependencies: ["ts-node", "tsconfig-paths"],
};

export default config;
