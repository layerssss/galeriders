import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';

class Layout extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any.isRequired,
  };

  render() {
    const { title, children } = this.props;

    return (
      <div
        style={{
          maxWidth: 1024,
          margin: '0 auto',
        }}
      >
        <Head>
          <title>{title ? `大风车百科 - ${title}` : '大风车百科'}</title>
        </Head>
        {title ? (
          <div
            style={{
              padding: 20,
              display: 'flex',
              flexFlow: 'row wrap',
            }}
          >
            <Link href="/">
              <a
                style={{
                  float: 'left',
                  width: 200,
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
            <h1 style={{ fontSize: '2em' }}>{title}</h1>
          </div>
        ) : (
          <Link href="/">
            <a
              style={{
                display: 'block',
                margin: '20px auto',
                width: '50vw',
                maxWidth: 300,
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
        )}
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
