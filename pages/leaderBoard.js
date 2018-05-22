import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ResponsiveStream } from '@nivo/stream';

import moment from '../lib/moment.js';
import sum from '../lib/sum.js';
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

    const days = _.times(30)
      .map(n => moment('2018-05-01').date(n + 1))
      .filter(d => d.isSameOrBefore(Date.now(), 'day'));
    const topUsers =
      allUsers &&
      _.orderBy(
        allUsers.filter(u => u.team),
        u => sum(getMonthRecords(u.records).map(r => r.hundreds)),
        'asc'
      ).slice(-10);

    return (
      <Layout>
        {allUsers && (
          <div style={{ height: 400 }}>
            <ResponsiveStream
              animate
              motionStiffness={90}
              motionDamping={15}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  translateX: 100,
                  itemWidth: 80,
                  itemHeight: 20,
                  symbolSize: 12,
                  symbolShape: 'circle',
                },
              ]}
              offsetType="expand"
              fillOpacity={0.85}
              borderColor="#000"
              borderWidth={3}
              margin={{
                top: 50,
                right: 110,
                bottom: 50,
                left: 0,
              }}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 36,
              }}
              colors={userIndex => topUsers[userIndex].team.color}
              keys={topUsers.map(u => u.name)}
              data={days.map(day =>
                _.fromPairs(
                  topUsers.map(user => [
                    user.name,
                    Math.floor(
                      sum(
                        getMonthRecords(user.records)
                          .filter(r => day.isSameOrAfter(r.date, 'day'))
                          .map(r => r.hundreds)
                      ) / 10
                    ),
                  ])
                )
              )}
            />
          </div>
        )}
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
