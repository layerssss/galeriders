import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import { Label, Pagination } from 'react-bootstrap';

import Layout from '../components/Layout.js';
import contentful from '../lib/contentful.js';
import Time from '../components/Time.js';

class Page extends React.PureComponent {
  static async getInitialProps({ query: { page: pageStr } }) {
    const page = Number(pageStr || '');
    const perPage = 24;
    const { total, items } = await contentful.getEntries({
      skip: page * perPage,
      limit: perPage,
      content_type: 'wiki',
      order: '-sys.updatedAt',
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      total,
      totalPages,
      items,
      page,
    };
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
    totalPages: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
  };

  render() {
    const { items, totalPages, page } = this.props;

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={totalPages}
            activePage={page + 1}
            onSelect={eventKey => {
              Router.push({
                pathname: '/',
                query: { page: String(eventKey - 1) },
              });
            }}
          />
        </div>
      </Layout>
    );
  }
}

export default Page;
