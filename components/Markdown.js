import React from 'react';
import PropTypes from 'prop-types';
import { markdown } from 'markdown';

class Markdown extends React.PureComponent {
  static propTypes = {
    source: PropTypes.string.isRequired,
  };

  render() {
    const { source, ...others } = this.props;

    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: markdown.toHTML(source) }}
        {...others}
      />
    );
  }
}

export default Markdown;
