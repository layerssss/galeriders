import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Label } from 'react-bootstrap';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Layout from '../components/Layout.js';
import Time from '../components/Time.js';
import data from '../lib/data.js';

@data
@graphql(
  gql`
    query {
      all_wiki_items {
        id
        title
        aliases
        updated_at
      }
    }
  `
)
class WikiIndexPage extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const {
      data: { all_wiki_items },
    } = this.props;

    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'stretch',
          }}
        >
          {all_wiki_items &&
            all_wiki_items.map(item => (
              <Link
                key={item.id}
                prefetch
                href={{
                  pathname: '/wiki',
                  query: { name: item.title },
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
                    <Time time={item.updated_at} />
                  </Label>
                  <h2
                    style={{
                      fontSize: '1.5em',
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h2>
                  <div style={{ margin: '5px 0' }}>
                    {item.aliases &&
                      item.aliases.map(alias => (
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
