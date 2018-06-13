const dev = process.env.NODE_ENV !== 'production';
const apiOrigin = dev
  ? process.env.GRAPI_URL || 'http://localhost:3000'
  : 'http://api.galeriders.club';
const origin = dev ? 'https://galeriders.dev' : 'https://galeriders.club';

const config = {
  dev,
  apiOrigin,
  origin,
};

module.exports = config;
