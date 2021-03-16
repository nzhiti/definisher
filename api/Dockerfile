FROM node:13.12

RUN mkdir /home/node/app/ && chown node:node /home/node/app/
WORKDIR /home/node/app/
COPY . ./
RUN yarn install && yarn cache clean
RUN yarn global add nodemon
ENTRYPOINT ["nodemon"]


