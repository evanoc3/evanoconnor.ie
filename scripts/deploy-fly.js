#!/usr/bin/env zx

import "zx/globals";

$.preferLocal = true;

$.env.DOTENV_PRIVATE_KEY_PRODUCTION = (process.env.DOTENV_PRIVATE_KEY_PRODUCTION !== undefined) 
	? process.env.DOTENV_PRIVATE_KEY_PRODUCTION
	: await $`dotenvx get -f .env.keys --format eval DOTENV_PRIVATE_KEY_PRODUCTION`;

await $`fly deploy --remote-only --build-secret DOTENV_PRIVATE_KEY_PRODUCTION="${DOTENV_PRIVATE_KEY_PRODUCTION}"`;
