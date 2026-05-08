import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended, // Use ESLint's recommended rules
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // or "commonjs" if not using ESM
      globals: {
        ...globals.node, // Enables Node.js globals like 'process' and '__dirname'
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
    ignores: ["node_modules/", "dist/", "build/"],
  },
];
