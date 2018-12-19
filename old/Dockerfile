FROM node:8.9
RUN mkdir /node
WORKDIR /node
ADD ./package.json .
ADD ./yarn.lock .
RUN yarn install --frozen-lock --production

ADD . .

RUN yarn build


ENV PORT '80'

ENTRYPOINT yarn start

