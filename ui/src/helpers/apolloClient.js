import { ApolloClient, InMemoryCache, ApolloLink } from "apollo-boost";
import { BatchHttpLink } from "apollo-link-batch-http";

import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        console.error(
          ["Error:", ...graphQLErrors.map(({ message }) => message)].join("\n")
        );

      if (networkError) console.error(`[Network error]: ${networkError}`);
    }),
    setContext((request, previousContext) => {
      const token = window.localStorage.getItem("token");

      return {
        headers: {
          ...(token && {
            authorization: `Bearer ${token}`
          })
        }
      };
    }),
    new BatchHttpLink({
      uri: `${process.env.REACT_APP_API_ORIGIN}/graphql`,
    })
  ]),
  cache: new InMemoryCache({
    dataIdFromObject: node => node.id
  })
});

export default apolloClient;
