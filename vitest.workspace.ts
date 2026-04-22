import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/graph-core/vitest.config.ts", "packages/graph-react/vitest.config.ts", "packages/graph-editor/vitest.config.ts"]
  }
});
