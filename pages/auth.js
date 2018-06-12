import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Auth0Lock from 'auth0-lock';
import { graphql } from 'react-apollo';
import cookie from 'cookie';

import data from '../lib/data.js';

@data
@graphql(
  gql`
    mutation($token: String!) {
      login(token: $token) {
        id
      }
    }
  `,
  { name: 'login' }
)
class Auth extends React.Component {
  static contextTypes = {
    current_user: PropTypes.object,
    useSpinner: PropTypes.func.isRequired,
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { login } = this.props;
    const { current_user, useSpinner } = this.context;

    if (current_user) return this.redirect();

    const lock = new Auth0Lock(
      '5e6-38K1d7H5Lez-y8fcZyusyWVsKIGv',
      'galeriders.au.auth0.com',
      {
        rememberLastLogin: false,
        language: 'zh',
        auth: {
          responseType: 'token id_token',
          params: {
            scope: 'openid profile',
          },
        },
      }
    );

    // eslint-disable-next-line no-console
    lock.on('authorization_error', console.error);
    // eslint-disable-next-line no-console
    lock.on('unrecoverable_error', console.error);

    if (!window.location.hash) return lock.show();

    lock.on('authenticated', ({ idToken }) =>
      useSpinner(async () => {
        await login({
          variables: {
            token: idToken,
          },
        });

        document.cookie = cookie.serialize('token', idToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        this.redirect();
      })
    );
  }

  redirect = () => {
    const redirectPath = window.localStorage.getItem('redirectPath') || '/';
    window.localStorage.removeItem('redirectPath');
    window.location.href = redirectPath;
  };

  render() {
    return <div />;
  }
}

export default Auth;
