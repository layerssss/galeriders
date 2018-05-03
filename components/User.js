import React from 'react';
import PropTypes from 'prop-types';

import { Image } from 'react-bootstrap';

class User extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user } = this.props;
    const facebookId = user.auth0UserId.split('|')[1];

    return (
      <a href={`https://facebook.com/${facebookId}`} target="_blank">
        <Image
          src={`//graph.facebook.com/${facebookId}/picture?type=square`}
          alt={user.name}
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
    );
  }
}

export default User;
