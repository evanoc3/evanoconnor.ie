# syntax=docker/dockerfile:1

FROM node:lts-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --include=dev --force
RUN --mount=type=secret,id=DOTENV_PRIVATE_KEY_PRODUCTION,env=DOTENV_PRIVATE_KEY_PRODUCTION \
	  npm run build

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone/ .
CMD ["node", "./server.js"]
EXPOSE 3000
