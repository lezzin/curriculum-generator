FROM alpine:3.20 AS builder

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM alpine:3.20

RUN apk add --no-cache nodejs chromium

RUN echo "America/Sao_Paulo" > /etc/timezone

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENTRYPOINT ["node", "dist/main.js"]