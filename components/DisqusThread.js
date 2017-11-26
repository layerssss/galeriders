import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class DisqusThread extends React.PureComponent {
  static propTypes = {
    identifier: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { identifier } = this.props;

    // eslint-disable-next-line func-names
    window.disqus_config = function() {
      this.identifier = identifier;
    };

    const script = document.createElement('script');
    script.src = 'https://gale-riders.disqus.com/embed.js';
    const rootElement =
      // eslint-disable-next-line react/no-find-dom-node
      ReactDOM.findDOMNode(this);
    rootElement.appendChild(script);
  }

  render() {
    return <div id="disqus_thread" />;
  }
}

export default DisqusThread;
