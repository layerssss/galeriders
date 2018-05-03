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
        auth0UserId
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
      useSpinner: PropTypes.func.isRequired,
    };

    state = { loading: false };

    getChildContext = () => {
      const { data: { user } } = this.props;
      const { login, useSpinner } = this;

      return { login, user, useSpinner };
    };

    useSpinner = async func => {
      this.setState({
        loading: true,
      });
      await func();
      this.setState({
        loading: false,
      });
    };

    login = () => {
      window.localStorage.setItem('redirectPath', window.location.pathname);
      window.location.href = '/auth';
    };

    render() {
      const { data: { error, loading } } = this.props;
      if (error) throw error;
      return (
        <React.Fragment>
          <ComposedComponent {...this.props} />
          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              transition: 'opacity ease .3s',
              ...(this.state.loading || loading
                ? {
                    backgroundColor: 'rgba(255,255,255, 0.5)',
                    opacity: 1,
                  }
                : {
                    pointerEvents: 'none',
                    opacity: 0,
                  }),
              alignItems: 'center',
            }}
          >
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw" />
          </div>
        </React.Fragment>
      );
    }
  };
