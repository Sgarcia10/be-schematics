# Prepare environment
FROM node:12-alpine as base
RUN apk add --update openssl
WORKDIR /app

FROM base AS build
COPY . .
ARG NEXUS_USERNAME_REPOSITORY
ARG NEXUS_PASSWORD_REPOSITORY
RUN chmod +x create-npmrc.sh
RUN sh create-npmrc.sh
RUN npm ci
RUN npm run build

FROM base
COPY package*.json yarn.* ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/.npmrc .npmrc
RUN npm install --production
CMD npm start