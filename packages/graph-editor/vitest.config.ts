import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@graph/core": fileURLToPath(new URL("../graph-core/src/index.ts", import.meta.url)),
      "@graph/react": fileURLToPath(new URL("../graph-react/src/index.ts", import.meta.url))
    }
  },
  test: {
    environment: "jsdom"
  }
});
