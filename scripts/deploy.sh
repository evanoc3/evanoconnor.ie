#!/bin/sh

set -euo pipefail;

export PATH=$PWD/node_modules/.bin:$PATH;

if [ -z "${DOTENV_PRIVATE_KEY_PRODUCTION+1}" ]; then
	print "\$DOTENV_PRIVATE_KEY_PRODUCTION env var is required, but not set\n";
	exit 1;
fi

if [ -z "${FLY_API_TOKEN+1}" ]; then
	print "\$FLY_API_TOKEN env var is required, but not set\n";
	exit 1;
fi

flyctl deploy --remote-only --build-secret DOTENV_PRIVATE_KEY_PRODUCTION=$DOTENV_PRIVATE_KEY_PRODUCTION;
