import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Label } from 'react-bootstrap';

import Layout from '../components/Layout.js';
import contentful from '../lib/contentful.js';
import Time from '../components/Time.js';
import data from '../lib/data.js';

@data
class WikiIndexPage extends React.Component {
  static async getInitialProps() {
    const { items } = await contentful.getEntries({
      content_type: 'wiki',
      order: '-sys.updatedAt',
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
            <Link
              key={item.sys.id}
              prefetch
              href={{
                pathname: '/wiki',
                query: { name: item.fields.name },
              }}
            >
              <a
                style={{
                  display: 'block',
                  width: 250,
                  margin: 10,
                  flex: '1 0 auto',

                  boxShadow: '0 1px 5px #aaa',
                  textDecoration: 'none',
                  borderRadius: 5,
                  padding: 10,
                }}
              >
                <Label className="pull-right">
                  <Time time={item.sys.updatedAt} />
                </Label>
                <h2
                  style={{
                    fontSize: '1.5em',
                    margin: 0,
                  }}
                >
                  {item.fields.name}
                </h2>
                <div style={{ margin: '5px 0' }}>
                  {item.fields.aliases &&
                    item.fields.aliases.map(alias => (
                      <Label bsStyle="info" style={{ margin: 5 }} key={alias}>
                        {alias}
                      </Label>
                    ))}
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Layout>
    );
  }
}

export default WikiIndexPage;
