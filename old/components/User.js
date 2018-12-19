import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { Image } from 'react-bootstrap';

class User extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user } = this.props;

    return (
      <Link href={{ pathname: '/user', query: { id: user.id } }}>
        <a>
          <Image
            src={user.picture_url}
            alt={user.full_name}
            circle
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              border: 'solid 1px #666',
              boxShadow: '0 0 10px white',
            }}
          />
        </a>
      </Link>
    );
  }
}

export default User;
