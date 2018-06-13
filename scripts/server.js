const http = require('http');
const next = require('next');
const _ = require('lodash');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const httpProxyMiddleware = require('http-proxy-middleware');

const apiAgent = require('./apiAgent.js');
const runAsync = require('./runAsync.js');
const config = require('./config.js');

runAsync(async () => {
  _.assign(process, {
    apiAgent,
  });

  const expressApp = express();
  expressApp.set('etag', false);
  expressApp.set('x-powered-by', false);

  const nextApp = next({
    dev: config.dev,
  });

  await nextApp.prepare();

  expressApp.use('/playground', expressPlayground({ endpoint: '/graphql' }));
  expressApp.use(
    '/graphql',
    httpProxyMiddleware({
      target: `${config.apiOrigin}`,
      changeOrigin: true,
      agent: apiAgent,
    })
  );
  expressApp.use(nextApp.getRequestHandler());

  const httpServer = http.createServer(expressApp);

  await new Promise((resolve, reject) => {
    httpServer.listen(process.env.PORT || 3001, resolve);
    httpServer.on('error', reject);
  });

  const address = httpServer.address();
  // eslint-disable-next-line
  console.log(`listening to http://${address.address}:${address.port}`);
  await new Promise(resolve => {
    process.on('SIGINT', resolve);
    process.on('SIGTERM', resolve);
  });
});
