import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import { ResponsiveLine } from '@nivo/line';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import getMonthRecords from '../lib/getMonthRecords.js';
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
class TimelinePage extends React.Component {
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

    const days = _.times(30)
      .map(n => moment('2018-05-01').date(n + 1))
      .filter(d => d.isSameOrBefore(Date.now(), 'day'));

    return (
      <Layout>
        {allTeams && (
          <div style={{ height: 500 }}>
            <ResponsiveLine
              curve="basis"
              colorBy={team => team.color}
              margin={{
                top: 50,
                right: 110,
                bottom: 50,
                left: 60,
              }}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '日期',
                legendOffset: 36,
                legendPosition: 'center',
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '累积里程 (km)',
                legendOffset: -40,
                legendPosition: 'center',
              }}
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
              dotSize={10}
              dotColor="inherit:darker(0.3)"
              animate
              motionStiffness={90}
              motionDamping={15}
              data={sortTeams(allTeams).map(team => ({
                id: team.name,
                color: team.color,
                data: days.map(day => ({
                  x: `${day.date()}`,
                  y: Math.floor(
                    sum(
                      []
                        .concat(
                          ...team.users.map(user =>
                            getMonthRecords(user.records).filter(r =>
                              day.isSameOrAfter(r.date, 'day')
                            )
                          )
                        )
                        .map(r => r.hundreds)
                    ) / 10
                  ),
                })),
              }))}
            />
          </div>
        )}
      </Layout>
    );
  }
}

export default TimelinePage;
