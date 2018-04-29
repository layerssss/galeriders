import React from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'recompose';

export default ComposedComponent => {
  class WithUser extends ComposedComponent {
    static displayName = `WithUser(${getDisplayName(ComposedComponent)})`;
    static getInitialProps = ComposedComponent.getInitialProps;

    static contextTypes = {
      user: PropTypes.object,
      login: PropTypes.func.isRequired,
    };

    componentDidMount() {
      const { user, login } = this.context;
      if (!user) login();
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  return WithUser;
};
