# Development

The current version of node being used can be found in [`.nvmrc`](/.nvmrc).

## Setup

1. Checkout the repository

2. Run `npm install`

3. Run `npm run dev` to start a local development server.


## Building for Production

* Run `npm run build` to create a `dist` directory with all the static files necessary for hosting the website.

* Run `npm run build:docker` to build a docker image.

* Run `docker run -p 8080:80 evanoconnor.ie` to start a container running the production build.


## Deploying to Production

* Run `npm run deploy:fly` 
