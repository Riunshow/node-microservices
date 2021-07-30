FROM node:16.5.0-slim as builder
ARG SERVICE
ARG PORT
WORKDIR /usr/src/app

COPY --chown=node:node package*.json lerna.json ./
COPY --chown=node:node packages/ ./packages
COPY --chown=node:node services/${SERVICE} ./services/${SERVICE}
RUN npm install --loglevel notice --unsafe-perm

FROM node:16.5.0-slim
ARG SERVICE
ARG PORT
WORKDIR /usr/src/app
COPY --chown=node:node --from=builder /usr/src/app .

ENV NODE_ENV=production \
    PORT=${PORT} \
    SERVICE_NAME=${SERVICE}

EXPOSE 3000
CMD ["npm", "--prefix", "services/${SERVICE}", "start"]