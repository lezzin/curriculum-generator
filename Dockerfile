FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

ENV VITE_API_URL=/api

RUN npm run build

FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

RUN npm run build

RUN npm prune --production

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    nginx \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    supervisor

COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

COPY --from=backend-builder /app/backend/dist /app/backend/dist
COPY --from=backend-builder /app/backend/node_modules /app/backend/node_modules
COPY --from=backend-builder /app/backend/package.json /app/backend/package.json

COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

EXPOSE 3501

ENTRYPOINT ["/app/entrypoint.sh"]
