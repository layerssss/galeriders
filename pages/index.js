import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Link from 'next/link';
import { PageHeader, Button } from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import withUser from '../lib/withUser.js';

@data
@graphql(gql`
  query {
    allTeams {
      id
      name
    }
  }
`)
@withUser
class May extends React.PureComponent {
  static async getInitialProps() {
    return {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const { data: { loading, allTeams } } = this.props;

    return (
      <Layout title="五月挑战">
        <p>别名：</p>
        {!loading &&
          allTeams.map(team => (
            <div key={team.id}>
              <p>{team.name}</p>
            </div>
          ))}
        <PageHeader>其它</PageHeader>
        <Link href="/wikiIndex">
          <Button block>风车大百科</Button>
        </Link>
      </Layout>
    );
  }
}

export default May;
