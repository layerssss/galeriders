const config = require('./scripts/config.js');

module.exports = {
  publicRuntimeConfig: {
    ...config,
  },
  webpack: nextConfig => {
    /* eslint-disable no-param-reassign */

    for (const plugin of nextConfig.plugins) {
      if (plugin.constructor.name !== 'FriendlyErrorsWebpackPlugin') continue;
      plugin.shouldClearConsole = false;
    }
    return nextConfig;
  },
};
