// @ts-check
import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";

export default defineConfig({
  site: import.meta.env.PUBLIC_WWW_HOST,
  devToolbar: { enabled: false },
  trailingSlash: "always",
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          loadPaths: [ "./src/styles" ]
        }
      }
    },
    resolve: {
      alias: {
        "@": "/src"
      }
    }
  },
  integrations: [ lit() ]
});
