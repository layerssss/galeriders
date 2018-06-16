const { createClient: createContentful } = require('contentful');

const contentful = createContentful({
  space: 'cmwf5ppb92dc',
  accessToken:
    'f2c541374f7e115c9bdb8d05a9c56c8ccaa49d6ccc1785a38daa40abdc3b2355',
});

Promise.resolve()
  .then(async () => {
    const { items } = await contentful.getEntries({
      content_type: 'wiki',
    });

    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ items }));
  })
  .then(() => process.exit(0))
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error(error.stack);
    process.exit(1);
  });
