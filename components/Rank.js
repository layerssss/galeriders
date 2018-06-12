import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import User from '../components/User.js';
import Kilometers from './Kilometers.js';

class Rank extends React.Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    rankBy: PropTypes.func.isRequired,
  };

  render() {
    const { users, rankBy } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'center',
        }}
      >
        {_.orderBy(
          users
            .map(user => ({
              ...user,
              score: rankBy(user),
            }))
            .filter(user => user.score),
          u => u.score,
          'desc'
        ).map((user, userIndex) => (
          <div
            key={user.id}
            style={{
              width: 200,
              flex: '1 1 auto',
              margin: 10,
              display: 'flex',
              flexFlow: 'row nowrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: [
                `linear-gradient(to right, transparent, rgba(200, 200, 200, 0.7) 50%, #f9f9f9)`,
                !user.team
                  ? '#ccc'
                  : `left center / cover no-repeat url(${user.team.cover_url})`,
              ].join(', '),
              color: 'black',
              padding: '10px 2px',
            }}
          >
            <div
              style={{
                marginLeft: 10,
                width: 40,
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 0 5px black',
              }}
            >
              #
              <span
                style={{
                  fontSize: '1.5em',
                }}
              >
                {userIndex + 1}
              </span>
            </div>
            <User user={user} />
            <div
              style={{ lineHeight: 1, textAlign: 'right', flex: '1 1 auto' }}
            >
              {user.full_name}
              <br />
              <Kilometers hundreds={user.score} />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Rank;
