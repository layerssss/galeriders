const runAsync = func =>
  Promise.resolve()
    .then(async () => {
      await func();
    })
    .then(() => process.exit(0))
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error.stack);
      process.exit(1);
    });

module.exports = runAsync;
