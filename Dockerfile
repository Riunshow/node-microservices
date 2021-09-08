FROM node:16.8.0
ARG SERVICE_PATH
ARG PORT
WORKDIR /usr/src/app

ENV PORT=${PORT} \
    SERVICE_PATH=${SERVICE_PATH}

COPY --chown=node:node package.json lerna.json tsconfig.json yarn.lock ./

RUN set NODE_OPTIONS=--max-old-space-size=4096
RUN yarn install

COPY --chown=node:node packages/ ./packages
COPY --chown=node:node services/${SERVICE_PATH} ./services/${SERVICE_PATH}
RUN yarn lerna bootstrap
RUN yarn lerna run build

EXPOSE ${PORT}
CMD npm --prefix services/${SERVICE_PATH} start