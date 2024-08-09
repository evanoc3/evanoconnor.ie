#!/usr/bin/env node
"use strict";

import { promisify } from "node:util";
import { exec as __exec } from "node:child_process";
import { exit } from "node:process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const _exec = promisify(__exec);
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");


main();


async function main() {
	try {
		await ensureGitBranchIsMain();
		await ensureGitWorkingTreeIsClean();
		await buildViteDistBundle();
		await buildDockerImage();
		await deployToFlyIo();
	} catch(err) {
		console.error(`Error: ${err.message}`);
		exit(1);
	}

	console.log("Done.");
}

async function ensureGitBranchIsMain() {
	console.log("(1/5) Verifying git branch...");
	const stdout = await exec("git rev-parse --abbrev-ref HEAD", { cwd: rootDir });

	if (stdout !== "main") {
		throw new Error(`this script can only be run on the 'main' branch.`);
	}
}


async function exec(cmd, opts) {
	console.log(`Executing sub-process with command: "${cmd}"`);
	let { stdout } = await _exec(cmd, opts);

	stdout = stdout.toString().trim();
	if (stdout.length > 0) {
		console.log("> " + stdout.replaceAll("\n", "\n> "));
	}

	return stdout;
}


async function ensureGitWorkingTreeIsClean() {
	console.log("\n(2/5) Checking git working tree is clean...");
	const stdout = await exec("git status", { cwd: rootDir });
	const isGitWorkingTreeClean = stdout.includes("nothing to commit, working tree clean");

	if (!isGitWorkingTreeClean) {
		throw new Error("cannot proceed unless git working tree is clean. Please stash or commit any uncommitted changes and try again.")
	}
}


async function buildViteDistBundle() {
	console.log("\n(3/5) Building vite bundle...");
	await exec("npx vite build", { cwd: rootDir });
}


async function buildDockerImage() {
	console.log("\n(4/5) Building docker image...");
	await exec("docker build -t evanoconnor.ie .", { cwd: rootDir });
}


async function deployToFlyIo() {
	console.log("\n(5/5) Deploying to fly.io...");
	await exec("fly deploy", { cwd: rootDir });
}
