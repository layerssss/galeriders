import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import withData from './withData.js';

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(Component) {
  return Component.displayName || Component.name || 'Unknown';
}

export default ComposedComponent =>
  @withData
  @graphql(gql`
    query {
      user {
        id
        name
        picture
      }
    }
  `)
  class WithData extends React.Component {
    static displayName = `data(${getComponentDisplayName(ComposedComponent)})`;

    static async getInitialProps(ctx) {
      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx);
      }

      return {
        ...composedInitialProps,
      };
    }

    static propTypes = {
      data: PropTypes.object.isRequired,
    };

    static childContextTypes = {
      user: PropTypes.object,
      login: PropTypes.func.isRequired,
    };

    getChildContext = () => {
      const { data: { user } } = this.props;
      const { login } = this;

      return { login, user };
    };

    login = () => {
      window.localStorage.setItem('redirectPath', window.location.pathname);
      window.location.href = '/auth';
    };

    render() {
      const { data: { error } } = this.props;
      if (error) throw error;
      return <ComposedComponent {...this.props} />;
    }
  };
