import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./src/setupTests.ts",
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
