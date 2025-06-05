// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  devToolbar: { enabled: false },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          loadPaths: ["./src/styles"]
        }
      }
    },
    resolve: {
      alias: {
        "@": "/src"
      }
    }
  }
});
