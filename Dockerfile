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

RUN yarn build

ENTRYPOINT yarn start --port 80

