import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**"]),
  ...typescriptEslint.configs.recommended,
]);
