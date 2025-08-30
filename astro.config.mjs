// @ts-check
import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import sitemap from "@astrojs/sitemap";

const site = process.env.WWW_HOST || undefined;

export default defineConfig({
  site,
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
