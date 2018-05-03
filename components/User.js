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
            width: 30,
            height: 30,
            marginRight: 10,
          }}
        />
      </a>
    );
  }
}

export default User;
