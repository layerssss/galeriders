import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import withData from './withData.js';

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(Component) {
  return Component.displayName || Component.name || 'Unknown';
}

export default (...args) => ComposedComponent =>
  @withData
  @graphql(...args)
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

    render() {
      const { data: { error } } = this.props;
      if (error) throw error;
      return <ComposedComponent {...this.props} />;
    }
  };
