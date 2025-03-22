// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": "/src"
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          loadPaths: ["./src/styles"]
        }
      }
    }
  },
  devToolbar: { enabled: false },
  experimental: {
    svg: true
  }
});
