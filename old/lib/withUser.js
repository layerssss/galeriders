import React from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from 'recompose';

export default ComposedComponent => {
  class WithUser extends ComposedComponent {
    static displayName = `WithUser(${getDisplayName(ComposedComponent)})`;
    static getInitialProps = ComposedComponent.getInitialProps;

    static contextTypes = {
      current_user: PropTypes.object,
      login: PropTypes.func.isRequired,
    };

    componentDidMount() {
      const { current_user, login } = this.context;
      if (!current_user) login();
    }

    render() {
      const { current_user } = this.context;
      if (!current_user) return <div />;
      return <ComposedComponent {...this.props} />;
    }
  }

  return WithUser;
};
