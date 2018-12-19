import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';

Moment.locale('zh-cn');

class Time extends React.Component {
  static propTypes = {
    time: PropTypes.string.isRequired,
  };

  render() {
    const { time, ...others } = this.props;
    const moment = Moment(time);
    return (
      <span {...others} title={moment.format('LLL')}>
        {moment.fromNow()}
      </span>
    );
  }
}

export default Time;
