# ====
# Development
# ====
FROM node:13.12 AS development

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

RUN yarn global add parcel-bundler
ENV PATH="/home/node/.yarn/bin:${PATH}"

WORKDIR /home/node/app/

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install && yarn cache clean

# ====
# Production (build)
# ====
FROM node:13.12-slim AS build

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

RUN yarn global add parcel-bundler
ENV PATH="/home/node/.yarn/bin:${PATH}"

WORKDIR /home/node/app/

COPY --from=development --chown=root:root /home/node/app/node_modules ./node_modules
COPY . .

RUN parcel build ./src/index.html

# ====
# Production (served)
# ====
FROM nginx:1.17.9 AS production

COPY nginx-entrypoint.sh /

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /home/node/app/dist /usr/share/nginx/html

ENTRYPOINT [ "sh", "/nginx-entrypoint.sh" ]