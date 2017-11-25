import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/Layout.js';
import Markdown from '../components/Markdown.js';
import contentful from '../lib/contentful.js';

class Page extends React.PureComponent {
  static async getInitialProps({ query: { id } }) {
    const item = await contentful.getEntry(id);
    return {
      item,
    };
  }

  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  render() {
    const { item } = this.props;

    return (
      <Layout title={item.fields.name}>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
          }}
        >
          <span
            style={{
              fontSize: '5em',
              color: '#ccc',
              alignSelf: 'flex-start',
            }}
          >
            “
          </span>
          <Markdown
            style={{
              fontSize: '1.3em',
              maxWidth: 600,
              margin: 20,
            }}
            source={item.fields.content}
          />
          <span
            style={{
              fontSize: '5em',
              color: '#ccc',
              alignSelf: 'flex-end',
            }}
          >
            ”
          </span>
        </div>
      </Layout>
    );
  }
}

export default Page;
