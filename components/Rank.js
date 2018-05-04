import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import User from '../components/User.js';
import sum from '../lib/sum.js';

class Rank extends React.Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    records: PropTypes.array.isRequired,
  };

  render() {
    const { users, records } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'center',
        }}
      >
        {_.orderBy(
          users.map(u => ({
            ...u,
            total: sum(
              records.filter(r => r.user.id === u.id).map(r => r.hundreds)
            ),
          })),
          [u => u.total, u => u.name],
          ['desc', 'asc']
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
                `left center / cover no-repeat url(${user.team.cover.url})`,
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
              {user.name}
              <br />
              <span style={{ fontSize: '2em' }}>{user.total / 10}</span> km
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Rank;
