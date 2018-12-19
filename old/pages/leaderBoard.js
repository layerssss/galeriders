import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Rank from '../components/Rank';

@data
@graphql(
  gql`
    query {
      all_users {
        id
        full_name
        picture_url
        month_total_hundreds
        team {
          id
          name
          color
          cover_url
        }
      }
    }
  `
)
class LeaderBoard extends React.Component {
  static async getInitialProps() {
    return {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const {
      data: { all_users },
    } = this.props;

    return (
      <Layout>
        {all_users && (
          <Rank users={all_users} rankBy={user => user.month_total_hundreds} />
        )}
      </Layout>
    );
  }
}

export default LeaderBoard;
