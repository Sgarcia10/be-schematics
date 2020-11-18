# Prepare environment
FROM node:12-alpine as base
RUN apk add --update openssl
WORKDIR /app

FROM base AS build
COPY . .
RUN npm ci
RUN npm run build

FROM base
COPY package*.json yarn.* ./
COPY --from=build /app/dist ./dist
RUN npm install --production
CMD npm start