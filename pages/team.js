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
import Kilometers from '../components/Kilometers';
import moment from '../lib/moment.js';

@data
@graphql(
  gql`
    query($team_id: ID!) {
      team(id: $team_id) {
        id
        name
        color
        cover_url
        month_total_hundreds
        users {
          id
          full_name
          picture_url
          month_total_hundreds
          team {
            id
            color
            cover_url
          }
        }
        month_records {
          id
          hundreds
          time
          picture_url
          user {
            id
            full_name
            picture_url
          }
        }
      }
    }
  `,
  {
    options: ({ team_id }) => ({
      variables: {
        team_id,
      },
    }),
  }
)
class TeamPage extends React.PureComponent {
  static async getInitialProps({ query }) {
    const team_id = query.id;
    return { team_id };
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const {
      data: { team },
    } = this.props;

    return (
      <Layout>
        {team && (
          <Team
            team={{
              ...team,
            }}
            header={
              <div style={{ textAlign: 'center' }}>
                {team.name}
                <br />
                <Kilometers hundreds={team.month_total_hundreds} />
              </div>
            }
          >
            <div
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
                margin: '0 -5px',
              }}
            >
              <div
                style={{
                  // wrap it
                  flex: '1 0 auto',
                  width: 250,
                  margin: 5,
                }}
              >
                <Panel>
                  <Panel.Heading>
                    <Panel.Title>{team.name}</Panel.Title>
                  </Panel.Heading>
                  <Rank
                    users={team.users}
                    rankBy={user => user.month_total_hundreds}
                  />
                </Panel>
              </div>
              <div
                style={{
                  flex: '100 0 auto',
                  width: 250,
                  margin: 5,
                }}
              >
                {Object.entries(
                  _.groupBy(team.month_records, r =>
                    moment(r.time).format('dddd Do')
                  )
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
