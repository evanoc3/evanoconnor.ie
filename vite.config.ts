import { fileURLToPath } from "url";
import { join, dirname } from "path";
import type { UserConfig } from "vite";


const __dirname = fileURLToPath(dirname(import.meta.url));


export default {
	appType: "mpa",
	root: join(__dirname, "src"),
	publicDir: join(__dirname, "static"),
	envDir: __dirname,
	build: {
		outDir: join(__dirname, "dist"),
		emptyOutDir: true,
		rollupOptions: {
			input: [
				join(__dirname, "src", "index.html"),
				join(__dirname, "src", "cv", "index.html"),
				join(__dirname, "src", "404.html"),
			]
		}
	}
} satisfies UserConfig;
