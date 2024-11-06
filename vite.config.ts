import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { defineConfig } from "vite";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	appType: "mpa",
	root: `${currentDir}/src`,
	publicDir: `${currentDir}/public`,
	envDir: currentDir,
	cacheDir: `${currentDir}/.vite`,
	build: {
		outDir: `${currentDir}/dist`,
		emptyOutDir: true,
		rollupOptions: {
			input: [
				`${currentDir}/src/index.html`,
				`${currentDir}/src/cv.html`,
				`${currentDir}/src/404.html`
			]
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler"
			}
		}
	},
});
