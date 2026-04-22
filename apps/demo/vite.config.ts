import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@graph/core": fileURLToPath(new URL("../../packages/graph-core/src/index.ts", import.meta.url)),
      "@graph/editor": fileURLToPath(new URL("../../packages/graph-editor/src/index.ts", import.meta.url)),
      "@graph/react": fileURLToPath(new URL("../../packages/graph-react/src/index.ts", import.meta.url))
    }
  }
});
