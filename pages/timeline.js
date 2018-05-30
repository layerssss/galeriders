import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import { Nav, NavItem } from 'react-bootstrap';

import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Team from '../components/Team.js';
import Kilometers from '../components/Kilometers.js';
import Rank from '../components/Rank.js';
import sum from '../lib/sum.js';
import moment from '../lib/moment.js';

const weeks = [];
{
  const may = moment('2018-05-01');
  let time = moment(may);
  while (time.isSame('2018-05-01', 'month')) {
    const start = moment(time).valueOf();
    let end = moment(time)
      .endOf('week')
      .valueOf();
    if (!moment(end).isSame(may, 'month')) end = moment(may).endOf('month');
    weeks.push({
      start,
      end,
    });
    time = moment(end).add(1, 'day');
  }
}

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
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  state = {
    week: weeks[0],
  };

  render() {
    const {
      data: { allTeams },
    } = this.props;

    const sortTeams = teams => _.sortBy(teams, t => t.order);

    return (
      <Layout>
        <Nav bsStyle="tabs">
          {weeks.map(week => (
            <NavItem
              active={this.state.week.start === week.start}
              key={week.start}
              onClick={event => {
                event.preventDefault();

                this.setState({ week });
              }}
            >
              {moment(week.start).format('MMMDo')} ~{' '}
              {moment(week.end).format('MMMDo')}
            </NavItem>
          ))}
        </Nav>
        {allTeams && (
          <>
            <h2 style={{ textAlign: 'center' }}>
              {moment(this.state.week.start).format('MMMDo')} ~{' '}
              {moment(this.state.week.end).format('MMMDo')}
            </h2>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              {sortTeams(allTeams)
                .map(team => ({
                  ...team,
                  records: [].concat(
                    ...team.users.map(u =>
                      u.records.map(r => ({
                        // wrap it
                        ...r,
                        user: { ...u },
                      }))
                    )
                  ),
                }))
                .map(({ records, ...team }) => ({
                  ...team,
                  weekRecords: records.filter(
                    r =>
                      moment(r.date).isSameOrAfter(
                        this.state.week.start,
                        'day'
                      ) &&
                      moment(r.date).isSameOrBefore(this.state.week.end, 'day')
                  ),
                  sumRecords: records.filter(r =>
                    moment(r.date).isSameOrBefore(this.state.week.end, 'day')
                  ),
                }))
                .map(({ weekRecords, sumRecords, ...team }) => (
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
                              hundreds={sum(weekRecords.map(r => r.hundreds))}
                            />
                          </span>
                          <br />
                          该周累积里程:
                          <Kilometers
                            hundreds={sum(sumRecords.map(r => r.hundreds))}
                          />
                        </div>
                      }
                    >
                      <Rank
                        users={team.users.map(user => ({ ...user, team }))}
                        records={weekRecords}
                      />
                    </Team>
                  </div>
                ))}
            </div>
          </>
        )}
      </Layout>
    );
  }
}

export default TimelinePage;
