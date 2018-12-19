import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

import withData from './withData.js';

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(Component) {
  return Component.displayName || Component.name || 'Unknown';
}

export default ComposedComponent =>
  @withData
  @graphql(gql`
    query {
      current_user {
        id
        full_name
        picture_url
      }
      all_teams {
        id
        name
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
      current_user: PropTypes.object,
      all_teams: PropTypes.array,
      login: PropTypes.func.isRequired,
      useSpinner: PropTypes.func.isRequired,
    };

    state = { loading: false };

    getChildContext = () => {
      const {
        data: { current_user, all_teams },
      } = this.props;
      const { login, useSpinner } = this;

      return { login, current_user, useSpinner, all_teams };
    };

    useSpinner = async func => {
      this.setState({
        loading: true,
      });

      try {
        await func();
      } catch (error) {
        alert(error.message);
        _.defer(() => {
          throw error;
        });
      }

      this.setState({
        loading: false,
      });
    };

    login = () => {
      if (window.location.pathname !== '/auth')
        window.localStorage.setItem('redirectPath', window.location.href);
      window.location.href = '/auth';
    };

    render() {
      const { data } = this.props;
      const { loading, error } = data;
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
