import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Layout from '../components/Layout.js';
import Markdown from '../components/Markdown.js';
import contentful from '../lib/contentful.js';

class Page extends React.PureComponent {
  static async getInitialProps() {
    const { items } = await contentful.getEntries({
      content_type: 'wiki',
    });

    return {
      items,
    };
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
  };

  render() {
    const { items } = this.props;

    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'stretch',
          }}
        >
          {items.map(item => (
            <div
              key={item.sys.id}
              style={{
                width: 200,
                margin: 10,
                flex: '1 0 auto',

                boxShadow: '0 1px 5px #aaa',
                borderRadius: 5,
                padding: 10,

                display: 'flex',
                flexFlow: 'column nowrap',
                justifyContent: 'stretch',
              }}
            >
              <h2
                style={{
                  fontSize: '2em',
                  margin: '10px 0',
                }}
              >
                <Link
                  prefetch
                  href={{ pathname: '/wiki', query: { name: item.fields.name } }}
                >
                  <a>{item.fields.name}</a>
                </Link>
              </h2>
              <Markdown
                style={{
                  flex: '1 0 auto',
                }}
                source={item.fields.content}
              />
              <div>
                <Link
                  prefetch
                  href={{ pathname: '/wiki', query: { name: item.fields.name } }}
                >
                  <a>查看...</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }
}

export default Page;
