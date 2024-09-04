import { fileURLToPath } from "node:url";
import { dirname, resolve, sep } from "node:path";
import assert from "node:assert";
import Sitemap from "vite-plugin-sitemap";
import type { UserConfig } from "vite";


const __dirname = fileURLToPath(dirname(import.meta.url));


export default {
	appType: "mpa",
	root: path`${__dirname}/src`,
	publicDir: path`${__dirname}/static`,
	envDir: path`${__dirname}`,
	build: {
		outDir: path`${__dirname}/dist`,
		emptyOutDir: true,
		rollupOptions: {
			input: [
				path`${__dirname}/src/index.html`,
				path`${__dirname}/src/cv.html`,
				path`${__dirname}/src/404.html`
			]
		}
	},
	plugins: [
		Sitemap({
			hostname: "https://evanoconnor.ie",
			exclude: [ "/404" ],
			changefreq: "monthly",
			robots: [
				{ userAgent: "*", allow: "/" },
				{ userAgent: "*", disallow: "/assets/" }
			],
			readable: true
		})
	]
} satisfies UserConfig;


function path(strings: TemplateStringsArray, ...args: any[]): string {
	assert(strings.length > 0);
	assert(args.length === strings.length - 1);

	let output = strings[0];

	if (strings.length > 1) {
		for(let i=1; i < strings.length; i++) {
			output += args[i-1];
			output += strings[i];
		}
	}

	// @ts-expect-error
	output = output.replaceAll("/", sep);
	output = resolve(output);
	return output;
}
