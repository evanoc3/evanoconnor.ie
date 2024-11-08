#!/bin/sh

set -euo pipefail;

export PATH=$PWD/node_modules/.bin:$PATH;

if [ -z "${DOTENV_PRIVATE_KEY_PRODUCTION+1}" ]; then
	DOTENV_PRIVATE_KEY_PRODUCTION=$(dotenvx get -f .env.keys --format eval DOTENV_PRIVATE_KEY_PRODUCTION);
fi

DOTENV_PRIVATE_KEY_PRODUCTION=$DOTENV_PRIVATE_KEY_PRODUCTION docker build -t evanoconnor.ie --secret id=DOTENV_PRIVATE_KEY_PRODUCTION .;
