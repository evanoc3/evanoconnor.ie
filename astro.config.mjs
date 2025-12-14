// @ts-check
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import vitePluginSvgr from "vite-plugin-svgr";

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
    },
    plugins: [ vitePluginSvgr() ]
  },
  integrations: [ react(), sitemap() ]
});
