import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import Head from 'next/head';
import cookie from 'cookie';

import initApollo from './initApollo';

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(Component) {
  return Component.displayName || Component.name || 'Unknown';
}

function parseCookies(context = {}) {
  const cookieValue = process.browser
    ? document.cookie
    : context.req && context.req.headers.cookie;

  return cookie.parse(cookieValue || '');
}

export default ComposedComponent =>
  class WithData extends React.Component {
    static displayName = `WithData(${getComponentDisplayName(
      ComposedComponent
    )})`;
    static propTypes = {
      serverState: PropTypes.object.isRequired,
    };

    static async getInitialProps(ctx) {
      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo(
        {},
        {
          getToken: () => parseCookies(ctx).token,
        }
      );

      // create the url prop which is passed to every page
      const url = {
        query: ctx.query,
        asPath: ctx.asPath,
        pathname: ctx.pathname,
      };

      // Run all GraphQL queries
      try {
        await getDataFromTree(
          <ComposedComponent ctx={ctx} url={url} {...composedInitialProps} />,
          {
            router: {
              asPath: ctx.asPath,
              pathname: ctx.pathname,
              query: ctx.query,
            },
            client: apollo,
          }
        );
      } catch (error) {
        if (process.browser) throw error;
        // eslint-disable-next-line no-console
        console.error(`Ignore error: ${error.message}`);
        // eslint-disable-next-line no-console
        console.error(error.stack);
        Head.rewind();
        return {
          serverState: {
            apollo: {
              data: {},
            },
          },
          ...composedInitialProps,
        };
      }

      if (!process.browser) {
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const serverState = {
        apollo: {
          data: apollo.cache.extract(),
        },
      };

      return {
        serverState,
        ...composedInitialProps,
      };
    }

    constructor(props) {
      super(props);
      this.apollo = initApollo(this.props.serverState.apollo.data, {
        getToken: () => parseCookies().token,
      });
    }

    render() {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      );
    }
  };
