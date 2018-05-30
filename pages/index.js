import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import { Alert } from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Record from '../components/Record';
import Team from '../components/Team';
import User from '../components/User';
import Kilometers from '../components/Kilometers';
import getDayRecords from '../lib/getDayRecords.js';
import getMonthRecords from '../lib/getMonthRecords.js';
import sum from '../lib/sum.js';
import moment from '../lib/moment.js';
import may from '../lib/may.js';

@data
@graphql(
  gql`
    query {
      allTeams(filter: { published: true }) {
        id
        name
        order
        color
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
                    width: 240,
                    margin: 5,
                    flex: '1 0 auto',
                  }}
                >
                  <Team
                    team={team}
                    header={
                      <div>
                        <span style={{ fontSize: 20 }}>
                          <Kilometers
                            hundreds={sum(
                              getMonthRecords(
                                [].concat(...team.users.map(u => u.records))
                              ).map(r => r.hundreds)
                            )}
                          />
                        </span>
                        {moment().isSame(may, 'month') && (
                          <>
                            <br />
                            今天累积里程:
                            <Kilometers
                              hundreds={sum(
                                team.dayRecords.map(r => r.hundreds)
                              )}
                            />
                          </>
                        )}
                      </div>
                    }
                  />
                </div>
              ))}
        </div>
        <hr />
        {!moment().isSame(may, 'month') && (
          <Alert bsStyle="success">
            五月挑战目前已经结束，看看五月志和琅琊榜吧。
          </Alert>
        )}
        {allTeams &&
          moment().isSame(may, 'month') && (
            <div style={{ padding: 5, display: 'flex', flexFlow: 'row wrap' }}>
              {sortRecords(
                [].concat(
                  ...allTeams.map(team =>
                    [].concat(
                      ...team.users.map(user =>
                        getDayRecords(user.records).map(record => ({
                          ...record,
                          user,
                          team,
                        }))
                      )
                    )
                  )
                )
              ).map(record => (
                <div
                  key={record.id}
                  style={{ width: 170, flex: '0 0 auto', margin: '20px auto' }}
                >
                  <Team header={<User user={record.user} />} team={record.team}>
                    <div style={{ padding: 10 }}>
                      <Record showUser={false} record={record} />
                    </div>
                  </Team>
                </div>
              ))}
            </div>
          )}
      </Layout>
    );
  }
}

export default May;
