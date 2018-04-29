import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  from,
} from 'apollo-boost';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, { getToken }) {
  return new ApolloClient({
    dataIdFromObject: o => o.id,
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: from([
      new ApolloLink((operation, forward) => {
        const token = getToken();

        if (token)
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${token}`,
            },
          }));

        return forward(operation);
      }),
      new HttpLink({
        uri: 'https://api.graph.cool/simple/v1/cjgjy05nx0k4q01860p3k1dzl', // Server URL (must be absolute)
        credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      }),
    ]),
    cache: new InMemoryCache().restore(initialState),
  });
}

export default function initApollo(initialState, { getToken }) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, { getToken });
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, { getToken });
  }

  return apolloClient;
}
