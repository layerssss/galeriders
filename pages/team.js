import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import { Panel } from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Rank from '../components/Rank.js';
import Team from '../components/Team.js';
import Record from '../components/Record';
import getMonthRecords from '../lib/getMonthRecords.js';
import moment from '../lib/moment.js';

@data
@graphql(
  gql`
    query($teamId: ID!) {
      team: Team(id: $teamId) {
        id
        name
        published
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
  `,
  {
    options: ({ teamId }) => ({
      variables: {
        teamId,
      },
    }),
  }
)
class TeamPage extends React.PureComponent {
  static async getInitialProps({ query }) {
    const teamId = query.id;
    return { teamId };
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const {
      data: { team },
    } = this.props;

    const sortRecords = records =>
      _.orderBy(records, [r => moment(r.date).valueOf()], ['desc']);

    const monthRecords = getMonthRecords(
      sortRecords(
        [].concat(
          ...team.users.map(u =>
            u.records.map(r => ({
              ...r,
              user: u,
            }))
          )
        )
      )
    );

    return (
      <Layout>
        {team && (
          <Team
            team={{
              ...team,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
              }}
            >
              <div
                style={{
                  // wrap it
                  flex: '1 0 auto',
                  width: 250,
                  marginRight: 20,
                }}
              >
                <Panel>
                  <Panel.Heading>
                    <Panel.Title>{team.name}</Panel.Title>
                  </Panel.Heading>
                  <Rank
                    users={team.users.map(u => ({ ...u, team }))}
                    records={monthRecords}
                  />
                </Panel>
              </div>
              <div
                style={{
                  flex: '100 0 auto',
                  width: 250,
                }}
              >
                {Object.entries(
                  _.groupBy(monthRecords, r => moment(r.date).format('dddd Do'))
                ).map(([day, records]) => (
                  <Panel key={day}>
                    <Panel.Heading>
                      <Panel.Title>{day}</Panel.Title>
                    </Panel.Heading>
                    <div
                      style={{
                        display: 'flex',
                        flexFlow: 'row wrap',
                      }}
                    >
                      {records.map(record => (
                        <div
                          key={record.id}
                          style={{ width: 200, flex: '0 0 auto' }}
                        >
                          <Record record={record} />
                        </div>
                      ))}
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          </Team>
        )}
      </Layout>
    );
  }
}

export default TeamPage;
