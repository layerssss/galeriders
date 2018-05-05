import React from 'react';
import PropTypes from 'prop-types';

class Kilometers extends React.PureComponent {
  static propTypes = {
    hundreds: PropTypes.number.isRequired,
  };

  render() {
    const { hundreds } = this.props;
    return (
      <>
        <span style={{ fontSize: '2em' }}>{(hundreds / 10).toFixed(1)}</span> km
      </>
    );
  }
}

export default Kilometers;
