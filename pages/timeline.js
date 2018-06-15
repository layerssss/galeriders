import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Nav, NavItem } from 'react-bootstrap';

import sum from '../lib/sum.js';
import data from '../lib/data.js';
import Layout from '../components/Layout.js';
import Team from '../components/Team.js';
import Kilometers from '../components/Kilometers.js';
import Rank from '../components/Rank.js';
import moment from '../lib/moment.js';

@data
@graphql(
  gql`
    query {
      weeks {
        id
        start_day
        end_day
      }
      all_teams {
        id
        name
        week_hundreds
        color
        cover_url
        users {
          id
          full_name
          picture_url
          week_hundreds
          team {
            id
            cover_url
            color
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
    weekIndex: 0,
  };

  render() {
    const {
      data: { all_teams, weeks },
    } = this.props;

    const week = !weeks ? null : weeks[this.state.weekIndex];

    return (
      <Layout>
        <Nav bsStyle="tabs">
          {weeks.map(({ id, start_day, end_day }, weekIndex) => (
            <NavItem
              active={this.state.weekIndex === weekIndex}
              key={id}
              onClick={event => {
                event.preventDefault();

                this.setState({ weekIndex });
              }}
            >
              {moment(start_day).format('MMMDo')} ~{' '}
              {moment(end_day).format('MMMDo')}
            </NavItem>
          ))}
        </Nav>
        {all_teams &&
          week && (
            <>
              <h2 style={{ textAlign: 'center' }}>
                {moment(week.start_day).format('MMMDo')} ~{' '}
                {moment(week.end_day).format('MMMDo')}
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                {all_teams.map(team => (
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
                              hundreds={
                                team.week_hundreds[this.state.weekIndex]
                              }
                            />
                          </span>
                          <br />
                          该周累积里程:
                          <Kilometers
                            hundreds={sum(
                              team.week_hundreds.slice(
                                0,
                                this.state.weekIndex + 1
                              )
                            )}
                          />
                        </div>
                      }
                    >
                      <Rank
                        users={team.users}
                        rankBy={user =>
                          user.week_hundreds[this.state.weekIndex]
                        }
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
