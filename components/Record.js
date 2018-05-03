import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

import User from './User.js';
import timezone from '../lib/timezone.js';

class Record extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
  };

  render() {
    const { record } = this.props;
    const today = moment().tz(timezone);

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
          <User user={record.user} />
          <br />
          <span style={{ fontSize: '2em' }}>{record.hundreds / 10}</span> km
          <br />
          {record.user.name}
          <br />
          {moment(record.date).isSame(today, 'week')
            ? moment(record.date).fromNow()
            : moment(record.date).format('dddd LT')}
        </div>
        <div style={{ width: '40%' }}>
          {record.file && (
            <a href={record.file.url} target="_blank">
              <Image src={record.file.url} style={{ width: '100%' }} />
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default Record;
