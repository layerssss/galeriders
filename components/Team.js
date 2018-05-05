import React from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';

import getMonthRecords from '../lib/getMonthRecords.js';
import Kilometers from './Kilometers.js';
import sum from '../lib/sum.js';

class Team extends React.Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    children: PropTypes.any,
  };

  render() {
    const { team, children } = this.props;

    const monthRecords = getMonthRecords(
      [].concat(
        ...team.users.map(u =>
          u.records.map(r => ({
            ...r,
            user: u,
          }))
        )
      )
    );

    return (
      <Well
        style={{
          margin: 10,
        }}
      >
        <div
          style={{
            position: 'relative',
            maxHeight: 200,
            ...(team.cover && {
              backgroundImage: `url(${team.cover.url})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }),
          }}
        >
          <div
            style={{
              paddingTop: '80%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(transparent, #f9f9f9)`,
              textIndent: -9999,
            }}
          >
            {team.name}:
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 24,
              color: 'white',
              textShadow: '0 0 20px black',
            }}
          >
            <Kilometers hundreds={sum(monthRecords.map(r => r.hundreds))} />
          </div>
        </div>
        {children}
      </Well>
    );
  }
}

export default Team;
