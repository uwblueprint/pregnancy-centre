FROM node:12.13.0 AS build
WORKDIR /app

RUN mkdir /qgtunnel && curl https://s3.amazonaws.com/quotaguard/qgtunnel-latest.tar.gz | tar xz -C /qgtunnel

COPY package.json package-lock.json ./
COPY . ./
RUN npm ci --only=production --silent
RUN npm run build

FROM node:12.13.0-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.qgtunnel ./
COPY --from=build /qgtunnel ./qgtunnel-install
# COPY ./prod.env ./.env

CMD [ "qgtunnel-install/bin/qgtunnel", "node", "dist/server.js" ]
