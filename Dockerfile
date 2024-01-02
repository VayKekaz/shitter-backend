FROM node:18-alpine as base

FROM base as build
WORKDIR /app
COPY package.json yarn.lock tsconfig*.json .yarnrc.yml ./
RUN yarn
COPY src/ ./src/
RUN yarn run build


FROM base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --production
COPY --from=build /app/dist/ ./dist/
ENTRYPOINT ["node", "dist/app", "server:start"]
