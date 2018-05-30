import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Rank from '../components/Rank';
import getMonthRecords from '../lib/getMonthRecords.js';

@data
@graphql(
  gql`
    query {
      allUsers {
        id
        name
        auth0UserId
        records {
          id
          hundreds
          date
          file {
            id
            url
          }
        }
        team {
          id
          published
          name
          color
          cover {
            id
            url
          }
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
      data: { allUsers },
    } = this.props;

    return (
      <Layout>
        {allUsers && (
          <Rank
            users={allUsers.filter(
              u => u.team && u.team.published && u.team.cover
            )}
            records={[].concat(
              ...allUsers.map(u =>
                getMonthRecords(u.records).map(r => ({ ...r, user: u }))
              )
            )}
          />
        )}
      </Layout>
    );
  }
}

export default LeaderBoard;
