FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]