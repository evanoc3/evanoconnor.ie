// @ts-check
import process from "node:process";
import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: process.env.PUBLIC_WWW_HOST,
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
  integrations: [ lit(), sitemap() ]
});
