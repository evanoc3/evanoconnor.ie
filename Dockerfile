# syntax=docker/dockerfile:1

FROM node:lts-alpine AS builder
WORKDIR /app
RUN curl -sfS https://dotenvx.sh | sh
COPY . .
RUN npm ci --include=dev
RUN --mount=type=secret,id=DOTENV_PRIVATE_KEY_PRODUCTION,env=DOTENV_PRIVATE_KEY_PRODUCTION \
	  npx dotenvx run -f .env.production -- npm run build

FROM nginx:stable-alpine-slim
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
