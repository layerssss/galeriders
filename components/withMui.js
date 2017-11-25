import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from 'material-ui/styles';
import getContext from '../lib/getContext.js';

// Apply some reset

@withStyles(theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    body: {
      margin: 0,
    },
  },
}))
class AppWrapper extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return this.props.children;
  }
}

function withMui(WrappedComponent) {
  class Component extends React.Component {
    static getInitialProps = WrappedComponent.getInitialProps;

    componentWillMount() {
      this.styleContext = getContext();
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <MuiThemeProvider
          theme={this.styleContext.theme}
          sheetsManager={this.styleContext.sheetsManager}
        >
          <AppWrapper>
            <WrappedComponent {...this.props} />
          </AppWrapper>
        </MuiThemeProvider>
      );
    }
  }

  return Component;
}

export default withMui;
