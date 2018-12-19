import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

import User from './User.js';
import Kilometers from './Kilometers.js';
import moment from '../lib/moment.js';

class Record extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
    showUser: PropTypes.bool,
  };

  static defaultProps = {
    showUser: true,
  };

  render() {
    const { record, showUser } = this.props;
    const today = moment();

    return (
      <div
        style={{
          padding: '10px 0',
          display: 'flex',
        }}
      >
        <div
          style={{
            flex: '1 0 auto',
            textAlign: 'center',
          }}
        >
          {showUser && (
            <>
              <User user={record.user} />
              <br />
            </>
          )}
          <Kilometers hundreds={record.hundreds} />
          <br />
          {record.user.full_name}
          <br />
          {moment(record.time).isSame(today, 'week')
            ? moment(record.time).calendar()
            : moment(record.time).format('Do dddd LT')}
        </div>
        <div style={{ width: '40%' }}>
          <a href={record.picture_url}>
            <Image src={record.picture_url} style={{ width: '100%' }} />
          </a>
        </div>
      </div>
    );
  }
}

export default Record;
