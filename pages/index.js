import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Record from '../components/Record';
import Team from '../components/Team';
import Kilometers from '../components/Kilometers';
import getDayRecords from '../lib/getDayRecords.js';
import sum from '../lib/sum.js';
import moment from '../lib/moment.js';

@data
@graphql(
  gql`
    query {
      allTeams(filter: { published: true }) {
        id
        name
        order
        cover {
          id
          url
        }
        users {
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
        }
      }
    }
  `
)
class May extends React.Component {
  static async getInitialProps() {
    return {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const {
      data: { allTeams },
    } = this.props;

    const sortTeams = teams => _.sortBy(teams, t => t.order);
    const sortRecords = records =>
      _.orderBy(records, [r => moment(r.date).valueOf()], ['desc']);

    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {allTeams &&
            sortTeams(allTeams)
              .map(team => ({
                ...team,
                dayRecords: getDayRecords(
                  [].concat(
                    ...team.users.map(u =>
                      u.records.map(r => ({
                        // wrap it
                        ...r,
                        user: { ...u },
                      }))
                    )
                  )
                ),
              }))
              .map(team => (
                <div
                  key={team.id}
                  style={{
                    width: 250,
                    flex: '1 0 auto',
                  }}
                >
                  <Team team={team}>
                    <p style={{ textAlign: 'center' }}>
                      今天累积里程:
                      <Kilometers
                        hundreds={sum(team.dayRecords.map(r => r.hundreds))}
                      />
                    </p>
                    {sortRecords(team.dayRecords).map(record => (
                      <Record key={record.id} record={record} />
                    ))}
                  </Team>
                </div>
              ))}
        </div>
      </Layout>
    );
  }
}

export default May;
