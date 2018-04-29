import React from 'react';
import jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Auth0Lock from 'auth0-lock';
import cookie from 'cookie';
import { graphql } from 'react-apollo';

import Layout from '../components/Layout.js';
import data from '../lib/data.js';

@data
@graphql(
  gql`
    mutation($idToken: String!, $name: String!, $picture: String!) {
      createUser(
        authProvider: { auth0: { idToken: $idToken } }
        name: $name
        picture: $picture
      ) {
        id
        name
        picture
      }
    }
  `,
  { name: 'createUser' }
)
class Auth extends React.PureComponent {
  static contextTypes = {
    user: PropTypes.object,
  };

  static propTypes = {
    createUser: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { createUser } = this.props;
    const { user } = this.context;

    if (user) return this.redirect();

    const lock = new Auth0Lock(
      '5e6-38K1d7H5Lez-y8fcZyusyWVsKIGv',
      'galeriders.au.auth0.com',
      {
        language: 'zh',
        auth: {
          autoParseHash: false,
          responseType: 'id_token',
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

    const match = window.location.hash.match(/id_token=([^\&]+)/);
    const [, idToken] = match;

    const { name, picture } = jwt.decode(idToken);

    document.cookie = cookie.serialize('token', idToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    try {
      await createUser({
        variables: {
          idToken,
          name,
          picture,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    this.redirect();
  }

  redirect = () => {
    const redirectPath = window.localStorage.getItem('redirectPath') || '/';
    window.localStorage.removeItem('redirectPath');
    window.location.href = redirectPath;
  };

  render() {
    return <Layout title="登录">登录中...</Layout>;
  }
}

export default Auth;
