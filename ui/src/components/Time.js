import React from "react";
import PropTypes from "prop-types";

import moment from "../helpers/moment";

class Time extends React.Component {
  static propTypes = {
    time: PropTypes.string.isRequired
  };

  render() {
    const { time, ...others } = this.props;
    const timeMoment = moment(time);
    return (
      <span {...others} title={timeMoment.format("LLL")}>
        {timeMoment.fromNow()}
      </span>
    );
  }
}

export default Time;
