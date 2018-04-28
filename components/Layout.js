import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import ReactGA from 'react-ga';
import FacebookProvider from 'react-facebook';

ReactGA.initialize('UA-80409715-5');

Router.onRouteChangeStart = () => {
  window.NProgress.start();
};

Router.onRouteChangeComplete = () => {
  window.NProgress.done();
  window.NProgress.remove();
};

class Layout extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    category: PropTypes.string,
    children: PropTypes.any.isRequired,
  };

  static defaultProps = {
    title: '首页',
    category: '大风车',
  };

  constructor(props) {
    super(props);

    this.state = {
      small: false,
    };
  }

  componentDidMount() {
    ReactGA.pageview(document.location.href);
    if (window.innerWidth < 640)
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ small: true });
  }

  render() {
    const { title, category, children } = this.props;

    return (
      <div
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <Head>
          <title>
            {title} - {category}
          </title>
        </Head>
        <div
          style={
            this.state.small
              ? {
                  fontSize: 32,
                  textAlign: 'center',
                }
              : {
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  fontSize: 32,
                  lineHeight: 1,
                }
          }
        >
          <a href="https://www.facebook.com/galeriders/">
            <span
              className="fa fa-fw fa-facebook-official"
              style={{ color: '#4267b2' }}
            >
              <span className="sr-only">Facebook</span>
            </span>
          </a>
          <a href="https://www.facebook.com/galeriders/">
            <span className="fa fa-fw fa-weixin" style={{ color: '#44b549' }}>
              <span className="sr-only">微信</span>
            </span>
          </a>
          <a href="https://www.strava.com/clubs/galeriders">
            <img
              style={{ width: '.9em', position: 'relative', top: '-.1em' }}
              src="/static/icon_strava.jpg"
              alt="Strava"
            />
          </a>
          <a href="https://www.oxfamtrailwalker.org.nz/otw18/teams/welly-queen">
            <img
              style={{
                width: '.9em',
                position: 'relative',
                top: '-.1em',
                margin: '0 .1em',
              }}
              src="/static/icon_wellyqueen.png"
              alt="Welly Queen"
            />
          </a>
          <a href="https://github.com/layerssss/galeriders">
            <span className="fa fa-github" style={{ color: '#444' }}>
              <span className="sr-only">GitHub</span>
            </span>
          </a>
        </div>
        <div
          style={{
            padding: 10,
            display: 'flex',
            flexFlow: 'row wrap',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Link href="/">
            <a
              style={{
                width: 80,
                maxWidth: '10vw',
                marginRight: 20,
              }}
            >
              <img
                style={{
                  width: '100%',
                }}
                src="/static/logo.png"
                alt="大风车"
              />
            </a>
          </Link>
          <div>
            <h1 style={{ fontSize: '2em', margin: '5px 0' }}>{title}</h1>
            <h2 style={{ fontSize: '1em', color: '#888', margin: 0 }}>
              {category}
            </h2>
          </div>
        </div>
        <div
          style={{
            borderTop: 'solid 1px #ccc',
            padding: '20px 10px',
          }}
        >
          <FacebookProvider appId="147211725922734" language="zh_CN">
            {children}
          </FacebookProvider>
        </div>
      </div>
    );
  }
}

export default Layout;
