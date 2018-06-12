FROM node:8.9
RUN mkdir /node
WORKDIR /node
ADD ./package.json .
ADD ./yarn.lock .
RUN yarn install --frozen-lock --production

ADD ./static ./static
ADD ./lib ./lib
ADD ./components ./components
ADD ./pages ./pages
ADD ./.babelrc .
ADD ./next.config.js ./next.config.js
ADD ./scripts ./scripts

RUN yarn build


ENV PORT '80'

ENTRYPOINT yarn start

