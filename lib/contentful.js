import { createClient as createContentful } from 'contentful';

const contentful = createContentful({
  space: 'cmwf5ppb92dc',
  accessToken:
    'f2c541374f7e115c9bdb8d05a9c56c8ccaa49d6ccc1785a38daa40abdc3b2355',
});

export default contentful;
