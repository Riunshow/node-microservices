FROM node:16.8.0

ARG SERVICE
ARG PORT
WORKDIR /usr/src/app

ENV PORT=${PORT} \
    SERVICE_NAME=${SERVICE}

COPY --chown=node:node package*.json lerna.json tsconfig.json yarn.lock ./

RUN set NODE_OPTIONS=--max-old-space-size=4096
RUN yarn install

COPY --chown=node:node packages/ ./packages
COPY --chown=node:node services/${SERVICE} ./services/${SERVICE}
RUN yarn lerna bootstrap
RUN yarn lerna run build

EXPOSE ${PORT}
CMD npm --prefix services/${SERVICE_NAME} start