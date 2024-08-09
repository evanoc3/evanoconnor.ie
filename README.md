# evanoconnor.ie

## Setup

The development workflow relies on [Node.js](https://nodejs.org/en)/[NPM](https://www.npmjs.com/), and [Vite](https://vitejs.dev/). The current version of node being used can be found in [`.nvmrc`](/.nvmrc).

The scripts in [`package.json`](/package.json) use Bash syntax and are only supported on Mac (Linux or WSL will probably work but are untested).


## Development

Check out the project and run `npm run dev` to start a local development server.


## Building for Production

1. Run `npm run dist` to create a `dist` directory with all the static files necessary for hosting the website.

2. Run `docker build -t evanoconnor.ie .` to build a docker image.

3. Run `docker run -p 8080:80 evanoconnor.ie` to start a container running the production build.


## Deployments

I'm currently using [Fly.io](https://fly.io) to host the website. With the flyctl tool configured locally, deploying is as easy as running `fly deploy`.


## External Services

* [umami](https://umami.is) &ndash; GDPR-compliant analytics


---

&copy; 2024 Evan O&apos;Connor. All rights reserved.

This project is licensed under the MIT License &ndash; see [`LICENSE`](/LICENSE) for details.
