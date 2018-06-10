const envProxyAgent = require('env-proxy-agent');

const config = require('./config.js');

const apiAgent = envProxyAgent(config.apiOrigin);

module.exports = apiAgent;
