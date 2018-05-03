import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'react-bootstrap';

import Layout from '../components/Layout.js';
import Markdown from '../components/Markdown.js';
import contentful from '../lib/contentful.js';
import data from '../lib/data.js';

@data
class Page extends React.PureComponent {
  static async getInitialProps({ query: { name } }) {
    const {
      items: [item],
    } = await contentful.getEntries({
      content_type: 'wiki',
      'fields.name': name,
    });

    if (!item) throw new Error('该词条可能已被删除');

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
      <Layout title={item.fields.name} category="风车大百科">
        <p>
          别名：
          {item.fields.aliases &&
            item.fields.aliases.map(alias => (
              <Label bsStyle="info" style={{ margin: 5 }} key={alias}>
                {alias}
              </Label>
            ))}
        </p>
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
