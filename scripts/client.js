const { ApolloClient, HttpLink, InMemoryCache } = require('apollo-boost');
const assert = require('assert');
const fetch = require('isomorphic-unfetch');

const { GALERIDERS_GRAPHCOOL_TOKEN } = process.env;
assert(GALERIDERS_GRAPHCOOL_TOKEN);

const client = new ApolloClient({
  link: new HttpLink({
    fetch,
    uri: 'https://api.graph.cool/simple/v1/cjgjy05nx0k4q01860p3k1dzl',
    headers: {
      Authorization: `Bearer ${GALERIDERS_GRAPHCOOL_TOKEN}`,
    },
  }),
  cache: new InMemoryCache(),
});

module.exports = client;
