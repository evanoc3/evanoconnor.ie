FROM nginx:stable-alpine-slim

COPY ./dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf
