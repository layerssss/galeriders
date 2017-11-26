import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';

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
          <title>{title ? `${title} - ${category}` : '大风车'}</title>
        </Head>
        <div
          style={{
            padding: 10,
            display: 'flex',
            flexFlow: 'row wrap',
            alignItems: 'center',
            justifyContent: title ? 'flex-start' : 'center',
          }}
        >
          <Link href="/">
            <a
              style={{
                width: title ? 80 : 100,
                maxWidth: '10vw',
                marginRight: 20,
              }}
            >
              <img
                style={{
                  width: '100%',
                }}
                src="/static/logo.png"
                alt="Gale Riders Logo"
              />
            </a>
          </Link>
          {title && (
            <div>
              <h1 style={{ fontSize: '2em', margin: '5px 0' }}>{title}</h1>
              <h2 style={{ fontSize: '1em', color: '#888', margin: 0 }}>
                {category}
              </h2>
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontSize: 32,
            lineHeight: 1,
          }}
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
              style={{ width: 28, position: 'relative', top: -3 }}
              src="/static/icon_strava.jpg"
              alt="Strava"
            />
          </a>
          <a href="https://www.oxfamtrailwalker.org.nz/otw18/teams/welly-queen">
            <img
              style={{
                width: 28,
                position: 'relative',
                top: -3,
                margin: '0 5px',
              }}
              src="/static/icon_wellyqueen.png"
              alt="Welly Queen"
            />
          </a>
        </div>
        <div
          style={{
            borderTop: 'solid 1px #ccc',
            padding: '20px 10px',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;
