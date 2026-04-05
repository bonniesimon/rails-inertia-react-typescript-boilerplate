import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
  // Global configurations
  {
    ignores: [
      "dist/",
      "node_modules/",
      "app/javascript/generated/",
      "app/javascript/routes*",
      "app/javascript/types/serializers/*",
    ],
  },

  // Base configs for all files
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React specific configurations for frontend files
  {
    files: ["app/javascript/**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Global custom rules that apply everywhere
  {
    rules: {
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },

  // Node.js environment for config files
  {
    files: ["eslint.config.js", "vite.config.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Prettier config must be the last one
  prettier,
];
