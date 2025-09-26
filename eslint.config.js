const js = require("@eslint/js");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettier = require("eslint-plugin-prettier");
const { defineConfig, globalIgnores } = require("eslint/config");
const eslintConfigPrettier = require("eslint-config-prettier");
module.exports = defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "commonjs",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      prettier,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "prettier/prettier": "warn",
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  eslintConfigPrettier,
  globalIgnores(['eslint.config.js', 'prettier.config.js']),
]);
