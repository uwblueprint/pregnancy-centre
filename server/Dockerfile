FROM node:12.13.0 AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY . ./
RUN npm ci --only=production --silent
RUN npm run build


FROM node:12.13.0-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY ./prod.env ./.env

CMD [ "node", "dist/server.js" ]
